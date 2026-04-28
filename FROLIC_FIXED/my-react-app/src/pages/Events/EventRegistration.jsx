import { useState, useEffect } from 'react';
import FormField from '../../components/Form/FormField';
import { groupService, participantService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ToastContext';
import { Users, UserPlus, Loader2, CheckCircle, Info, Mail, Phone, MapPin, GraduationCap, Plus, Trash2, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventRegistration = ({ event, onSuccess }) => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    
    const isIndividualEvent = event?.GroupMaxParticipants === 1;
    const minExtraMembers = Math.max(0, (event?.GroupMinParticipants || 1) - 1);
    const maxExtraMembers = Math.max(0, (event?.GroupMaxParticipants || 1) - 1);

    const [formData, setFormData] = useState({
        GroupName: '',
        ParticipantName: user?.UserName || '',
        ParticipantEmail: user?.EmailAddress || '',
        ParticipantEnrollmentNumber: '',
        ParticipantInstituteName: '',
        ParticipantCity: '',
        ParticipantMobile: user?.PhoneNumber || '',
    });

    const [teamMembers, setTeamMembers] = useState([]);
    const [leaderIndex, setLeaderIndex] = useState(-1); // -1 is the logged-in user, 0+ are extra team members
    
    // Initialize Team Members State when component loads
    useEffect(() => {
        if (!isIndividualEvent && minExtraMembers > 0) {
            const initialMembers = Array.from({ length: minExtraMembers }, () => ({
                ParticipantName: '',
                ParticipantEnrollmentNumber: '',
                ParticipantEmail: '',
                ParticipantMobile: '',
                ParticipantInstituteName: '',
                ParticipantCity: ''
            }));
            setTeamMembers(initialMembers);
        }
    }, [isIndividualEvent, minExtraMembers]);

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleTeamMemberChange = (index, field, value) => {
        const updatedMembers = [...teamMembers];
        updatedMembers[index][field] = value;
        setTeamMembers(updatedMembers);
        
        const errKey = `team_${index}_${field}`;
        if (errors[errKey]) {
            setErrors(prev => ({ ...prev, [errKey]: '' }));
        }
    };

    const addTeamMember = () => {
        if (teamMembers.length < maxExtraMembers) {
            setTeamMembers([
                ...teamMembers, 
                { ParticipantName: '', ParticipantEnrollmentNumber: '', ParticipantEmail: '', ParticipantMobile: '', ParticipantInstituteName: '', ParticipantCity: '' }
            ]);
        }
    };

    const removeTeamMember = (index) => {
        if (teamMembers.length > minExtraMembers) {
            const updatedMembers = teamMembers.filter((_, i) => i !== index);
            setTeamMembers(updatedMembers);
        }
    };

    const validate = () => {
        let tempErrors = {};
        
        // Validate Leader
        if (!isIndividualEvent && !formData.GroupName.trim()) tempErrors.GroupName = "Team name is required";
        if (!formData.ParticipantName.trim()) tempErrors.ParticipantName = "Your name is required";
        if (!formData.ParticipantEnrollmentNumber.trim()) tempErrors.ParticipantEnrollmentNumber = "Enrollment/ID is required";
        if (!formData.ParticipantInstituteName.trim()) tempErrors.ParticipantInstituteName = "Institute name is required";
        if (!formData.ParticipantMobile.trim() || formData.ParticipantMobile.length < 10) tempErrors.ParticipantMobile = "Valid mobile number is required";
        if (!formData.ParticipantEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ParticipantEmail.trim())) tempErrors.ParticipantEmail = "Valid email is required";
        
        // Validate Team Members
        if (!isIndividualEvent) {
            if (teamMembers.length < minExtraMembers) {
                tempErrors.submit = `You must add at least ${minExtraMembers} extra team member(s).`;
            }
            teamMembers.forEach((member, i) => {
                if (!member.ParticipantName?.trim()) tempErrors[`team_${i}_ParticipantName`] = "Name required";
                if (!member.ParticipantEnrollmentNumber?.trim()) tempErrors[`team_${i}_ParticipantEnrollmentNumber`] = "Enrollment required";
                if (!member.ParticipantInstituteName?.trim()) tempErrors[`team_${i}_ParticipantInstituteName`] = "Institute required";
                if (!member.ParticipantMobile?.trim() || member.ParticipantMobile.length < 10) tempErrors[`team_${i}_ParticipantMobile`] = "Valid phone required";
                if (!member.ParticipantEmail?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.ParticipantEmail.trim())) tempErrors[`team_${i}_ParticipantEmail`] = "Valid email required";
            });
        }
        
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            // 1. Create the Group
            const finalGroupName = isIndividualEvent 
                ? `${formData.ParticipantName}-${formData.ParticipantEnrollmentNumber}`
                : formData.GroupName;

            const groupResponse = await groupService.create({
                GroupName: finalGroupName,
                EventID: event._id
            });
            const groupId = groupResponse.group._id;

            // 2. Create the Main Participant with all requested fields
            await participantService.create({
                ParticipantName: formData.ParticipantName,
                ParticipantEnrollmentNumber: formData.ParticipantEnrollmentNumber,
                ParticipantEmail: formData.ParticipantEmail,
                ParticipantMobile: formData.ParticipantMobile,
                ParticipantInstituteName: formData.ParticipantInstituteName,
                ParticipantCity: formData.ParticipantCity,
                IsGroupLeader: leaderIndex === -1,
                GroupID: groupId
            });

            // 3. Create all extra Team Members
            if (!isIndividualEvent && teamMembers.length > 0) {
                await Promise.all(teamMembers.map((member, index) => participantService.create({
                    ParticipantName: member.ParticipantName,
                    ParticipantEnrollmentNumber: member.ParticipantEnrollmentNumber,
                    ParticipantEmail: member.ParticipantEmail,
                    ParticipantMobile: member.ParticipantMobile,
                    ParticipantInstituteName: member.ParticipantInstituteName,
                    ParticipantCity: member.ParticipantCity,
                    IsGroupLeader: leaderIndex === index,
                    GroupID: groupId
                })));
            }

            addToast(`Successfully registered for ${event.EventName}!`, 'success');
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
            setErrors({ submit: err.response?.data?.message || err.message || "Registration failed. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    if (!user && !user?.isAdmin && !user?.isCoordinator) {
        return (
            <div className="text-center py-10 space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex flex-col items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-primary" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Account Required</h3>
                    <p className="text-gray-400 max-w-sm mx-auto">You must sign in or create an account to register for events at Frolic.</p>
                </div>
                <Link to="/login" className="btn-primary inline-flex py-3 px-8 shadow-lg shadow-primary/20">Sign In / Sign Up</Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto max-h-[80vh] px-2 py-4 no-scrollbar">
            {errors.submit && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-2xl mb-6 text-sm flex items-center gap-3">
                    <Info size={18} />
                    {errors.submit}
                </div>
            )}

            <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/10 rounded-[2rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/30 transition-colors duration-500"></div>
                <div className="flex items-center gap-5 relative z-10 justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                            <Users className="text-primary" size={32} />
                        </div>
                        <div>
                            <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mb-1">Official Registration</p>
                            <h4 className="text-2xl font-display font-bold text-white leading-tight">{event.EventName}</h4>
                            {!isIndividualEvent && (
                                <p className="text-xs text-gray-400 mt-1">Group Size: {event.GroupMinParticipants} - {event.GroupMaxParticipants} Members</p>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] mb-1">Registration Fee</p>
                        <h4 className="text-2xl font-display font-bold text-primary leading-tight">₹{event.EventFees || 0}</h4>
                    </div>
                </div>
            </div>

            {!isIndividualEvent && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1 h-6 bg-primary rounded-full"></div>
                        <h5 className="text-white font-bold uppercase text-xs tracking-widest">Team Identity</h5>
                    </div>
                    <FormField
                        label="Team Name"
                        name="GroupName"
                        value={formData.GroupName}
                        onChange={handleChange}
                        error={errors.GroupName}
                        placeholder="Enter a unique name for your team"
                        icon={<Users size={18} />}
                        required
                    />
                </div>
            )}

            <div className="space-y-6 pt-4 border-t border-white/5 relative">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-6 bg-secondary rounded-full"></div>
                        <h5 className="text-white font-bold uppercase text-xs tracking-widest">{isIndividualEvent ? 'Personal Details' : 'Participant 1 (You)'}</h5>
                    </div>
                    {!isIndividualEvent && (
                        <label className={`flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${leaderIndex === -1 ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                            <input 
                                type="radio" 
                                name="groupLeaderRadio" 
                                className="hidden" 
                                checked={leaderIndex === -1} 
                                onChange={() => setLeaderIndex(-1)} 
                            />
                            {leaderIndex === -1 && <Award size={14} />}
                            {leaderIndex === -1 ? 'Team Leader' : 'Make Leader'}
                        </label>
                    )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        label="Full Name"
                        name="ParticipantName"
                        value={formData.ParticipantName}
                        onChange={handleChange}
                        error={errors.ParticipantName}
                        placeholder="Lead participant name"
                        icon={<UserPlus size={18} />}
                        required
                    />
                    <FormField
                        label="Enrollment / ID Number"
                        name="ParticipantEnrollmentNumber"
                        value={formData.ParticipantEnrollmentNumber}
                        onChange={handleChange}
                        error={errors.ParticipantEnrollmentNumber}
                        placeholder="Your university ID"
                        icon={<GraduationCap size={18} />}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        label="Email Address"
                        name="ParticipantEmail"
                        type="email"
                        value={formData.ParticipantEmail}
                        onChange={handleChange}
                        error={errors.ParticipantEmail}
                        placeholder="active@email.com"
                        icon={<Mail size={18} />}
                        required
                    />
                    <FormField
                        label="Contact Number"
                        name="ParticipantMobile"
                        value={formData.ParticipantMobile}
                        onChange={handleChange}
                        error={errors.ParticipantMobile}
                        placeholder="10 digit mobile"
                        icon={<Phone size={18} />}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        label="Institute Name"
                        name="ParticipantInstituteName"
                        value={formData.ParticipantInstituteName}
                        onChange={handleChange}
                        error={errors.ParticipantInstituteName}
                        placeholder="e.g. Darshan University"
                        icon={<GraduationCap size={18} />}
                        required
                    />
                    <FormField
                        label="City"
                        name="ParticipantCity"
                        value={formData.ParticipantCity}
                        onChange={handleChange}
                        placeholder="Your current city"
                        icon={<MapPin size={18} />}
                    />
                </div>
            </div>

            {/* Additional Team Members Section */}
            {!isIndividualEvent && teamMembers.map((member, index) => (
                <div key={index} className="space-y-6 pt-8 pb-4 border-t border-white/10 relative">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                            <h5 className="text-white font-bold uppercase text-xs tracking-widest">Team Member {index + 2}</h5>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className={`flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${leaderIndex === index ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                                <input 
                                    type="radio" 
                                    name="groupLeaderRadio" 
                                    className="hidden" 
                                    checked={leaderIndex === index} 
                                    onChange={() => setLeaderIndex(index)} 
                                />
                                {leaderIndex === index && <Award size={14} />}
                                {leaderIndex === index ? 'Team Leader' : 'Make Leader'}
                            </label>
                            {teamMembers.length > minExtraMembers && (
                                <button
                                    type="button"
                                    onClick={() => removeTeamMember(index)}
                                    className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-red-400/10 px-3 py-1.5 rounded-full"
                                >
                                    <Trash2 size={12} /> Remove
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            label="Full Name"
                            name={`team_${index}_ParticipantName`}
                            value={member.ParticipantName}
                            onChange={(e) => handleTeamMemberChange(index, 'ParticipantName', e.target.value)}
                            error={errors[`team_${index}_ParticipantName`]}
                            placeholder="Member name"
                            icon={<UserPlus size={18} />}
                            required
                        />
                        <FormField
                            label="Enrollment / ID Number"
                            name={`team_${index}_ParticipantEnrollmentNumber`}
                            value={member.ParticipantEnrollmentNumber}
                            onChange={(e) => handleTeamMemberChange(index, 'ParticipantEnrollmentNumber', e.target.value)}
                            error={errors[`team_${index}_ParticipantEnrollmentNumber`]}
                            placeholder="University ID"
                            icon={<GraduationCap size={18} />}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            label="Email Address"
                            name={`team_${index}_ParticipantEmail`}
                            type="email"
                            value={member.ParticipantEmail}
                            onChange={(e) => handleTeamMemberChange(index, 'ParticipantEmail', e.target.value)}
                            error={errors[`team_${index}_ParticipantEmail`]}
                            placeholder="active@email.com"
                            icon={<Mail size={18} />}
                            required
                        />
                        <FormField
                            label="Contact Number"
                            name={`team_${index}_ParticipantMobile`}
                            value={member.ParticipantMobile}
                            onChange={(e) => handleTeamMemberChange(index, 'ParticipantMobile', e.target.value)}
                            error={errors[`team_${index}_ParticipantMobile`]}
                            placeholder="10 digit mobile"
                            icon={<Phone size={18} />}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            label="Institute Name"
                            name={`team_${index}_ParticipantInstituteName`}
                            value={member.ParticipantInstituteName}
                            onChange={(e) => handleTeamMemberChange(index, 'ParticipantInstituteName', e.target.value)}
                            error={errors[`team_${index}_ParticipantInstituteName`]}
                            placeholder="e.g. Darshan University"
                            icon={<GraduationCap size={18} />}
                            required
                        />
                        <FormField
                            label="City"
                            name={`team_${index}_ParticipantCity`}
                            value={member.ParticipantCity}
                            onChange={(e) => handleTeamMemberChange(index, 'ParticipantCity', e.target.value)}
                            error={errors[`team_${index}_ParticipantCity`]}
                            placeholder="Current city"
                            icon={<MapPin size={18} />}
                        />
                    </div>
                </div>
            ))}

            {/* Add Team Member Button */}
            {!isIndividualEvent && teamMembers.length < maxExtraMembers && (
                <div className="pt-4 border-t border-white/5">
                    <button
                        type="button"
                        onClick={addTeamMember}
                        className="w-full border-2 border-dashed border-white/20 hover:border-primary/50 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white py-4 rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-sm"
                    >
                        <Plus size={18} /> Add Team Member (Up to {event.GroupMaxParticipants} total)
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-2">
                        {teamMembers.length + 1} / {event.GroupMaxParticipants} Members Added
                    </p>
                </div>
            )}

            <div className="pt-6">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(233,30,99,0.3)] hover:shadow-[0_15px_40px_rgba(233,30,99,0.4)] transition-all group overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {loading ? (
                        <Loader2 className="animate-spin" size={24} />
                    ) : (
                        <>
                            <CheckCircle size={22} className="group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-lg">
                                {event.EventFees && event.EventFees > 0 ? `Pay ₹${event.EventFees} & Submit` : "Confirm Registration"}
                            </span>
                        </>
                    )}
                </button>
                <p className="text-center text-gray-500 text-[10px] uppercase tracking-widest mt-6">
                    By confirming, you agree to our event rules and code of conduct.
                </p>
            </div>
        </form>
    );
};

export default EventRegistration;
