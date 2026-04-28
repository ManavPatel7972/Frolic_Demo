import { useState, useEffect } from 'react';
import FormField from '../../components/Form/FormField';
import { Send, CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '../../components/ToastContext';
import { eventService, departmentService, userService } from '../../services/api';

const AddEvent = ({ isModal = false, onSuccess }) => {
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        EventName: '',
        EventTagline: '',
        EventImage: '',
        EventDescription: '',
        GroupMinParticipants: 1,
        GroupMaxParticipants: 1,
        EventFees: 0,
        EventFirstPrice: 0,
        EventSecondPrice: 0,
        EventThirdPrice: 0,
        DepartmentID: '',
        EventCoOrdinatorID: '',
        EventMainStudentCoOrdinatorName: '',
        EventMainStudentCoOrdinatorPhone: '',
        EventMainStudentCoOrdinatorEmail: '',
        EventLocation: '',
        EventLocation: '',
        MaxGroupsAllowed: 50,
        EventType: 'Technical',
        IsGroupEvent: false
    });
    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoadingData(true);
            try {
                const [deptData, userData] = await Promise.all([
                    departmentService.getAll().catch(err => {
                        console.error("Dept fetch failed", err);
                        return [];
                    }),
                    userService.getAll().catch(err => {
                        console.error("User fetch failed", err);
                        return [];
                    })
                ]);
                
                if (Array.isArray(deptData)) {
                    setDepartments(deptData.map(d => ({ label: d.DepartmentName, value: d._id })));
                }
                
                if (Array.isArray(userData)) {
                    const adminsAndCoordinators = userData.filter(u => u.isAdmin || u.isCoordinator);
                    setUsers(adminsAndCoordinators.map(u => ({ 
                        label: `${u.UserName} (${u.isAdmin ? 'Admin' : 'Coordinator'})`, 
                        value: u._id 
                    })));
                }

                if ((!deptData || deptData.length === 0) && (!userData || userData.length === 0)) {
                    console.warn("No departments or users found in database.");
                }
            } catch (err) {
                console.error("Critical error fetching form data", err);
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.EventName.trim()) tempErrors.EventName = "Event title is required";
        if (!formData.DepartmentID) tempErrors.DepartmentID = "Department is required";
        if (!formData.EventCoOrdinatorID) tempErrors.EventCoOrdinatorID = "Faculty Co-ordinator is required";
        if (formData.EventFees < 0) tempErrors.EventFees = "Fees cannot be negative";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            try {
                await eventService.create(formData);
                addToast(`${formData.EventName} has been created successfully!`, 'success');
                setFormData({
                    EventName: '',
                    EventTagline: '',
                    EventImage: '',
                    EventDescription: '',
                    GroupMinParticipants: 1,
                    GroupMaxParticipants: 1,
                    EventFees: 0,
                    EventFirstPrice: 0,
                    EventSecondPrice: 0,
                    EventThirdPrice: 0,
                    DepartmentID: '',
                    EventCoOrdinatorID: '',
                    EventMainStudentCoOrdinatorName: '',
                    EventMainStudentCoOrdinatorPhone: '',
                    EventMainStudentCoOrdinatorEmail: '',
                    EventLocation: '',
                    MaxGroupsAllowed: 50,
                    EventType: 'Technical',
                    IsGroupEvent: false
                });
                if (onSuccess) onSuccess();
            } catch (err) {
                setErrors({ submit: err.response?.data?.message || "Failed to launch event" });
            } finally {
                setLoading(false);
            }
        }
    };

    const eventTypes = [
        { label: 'Technical', value: 'Technical' },
        { label: 'Non-Technical', value: 'Non-Technical' }
    ];

    const formContent = (
        <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 text-sm">
                    {errors.submit}
                </div>
            )}

            <FormField
                label="Event Title"
                name="EventName"
                value={formData.EventName}
                onChange={handleChange}
                error={errors.EventName}
                placeholder="e.g. Code-A-Thon 2025"
                required
            />

            <FormField
                label="Event Image Cover URL"
                name="EventImage"
                value={formData.EventImage}
                onChange={handleChange}
                placeholder="https://example.com/event-cover.jpg"
            />

            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                    <label className="text-white text-sm font-bold flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="IsGroupEvent"
                            checked={!formData.IsGroupEvent}
                            onChange={() => setFormData(prev => ({ ...prev, IsGroupEvent: false, GroupMinParticipants: 1, GroupMaxParticipants: 1 }))}
                            className="accent-primary w-4 h-4"
                        />
                        Individual Event
                    </label>
                    <label className="text-white text-sm font-bold flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="IsGroupEvent"
                            checked={formData.IsGroupEvent}
                            onChange={() => setFormData(prev => ({ ...prev, IsGroupEvent: true, GroupMinParticipants: 2, GroupMaxParticipants: 4 }))}
                            className="accent-primary w-4 h-4"
                        />
                        Group Event
                    </label>
                </div>

                {formData.IsGroupEvent && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-300">
                        <FormField
                            label="Min Participants"
                            name="GroupMinParticipants"
                            type="number"
                            value={formData.GroupMinParticipants}
                            onChange={handleChange}
                            required
                        />
                        <FormField
                            label="Max Participants"
                            name="GroupMaxParticipants"
                            type="number"
                            value={formData.GroupMaxParticipants}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    label="Department"
                    name="DepartmentID"
                    type="select"
                    value={formData.DepartmentID}
                    onChange={handleChange}
                    error={errors.DepartmentID}
                    options={departments}
                    placeholder={loadingData ? "Loading departments..." : departments.length === 0 ? "No departments found (Seed DB)" : "Select Department"}
                    required
                />

                <FormField
                    label="Faculty Co-ordinator"
                    name="EventCoOrdinatorID"
                    type="select"
                    value={formData.EventCoOrdinatorID}
                    onChange={handleChange}
                    error={errors.EventCoOrdinatorID}
                    options={users}
                    placeholder={loadingData ? "Loading coordinators..." : users.length === 0 ? "No coordinators found (Seed DB)" : "Select Co-ordinator"}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    label="Event Type"
                    name="EventType"
                    type="select"
                    value={formData.EventType}
                    onChange={handleChange}
                    options={eventTypes}
                    required
                />
                <FormField
                    label="Registration Fee (₹)"
                    name="EventFees"
                    type="number"
                    value={formData.EventFees}
                    onChange={handleChange}
                    error={errors.EventFees}
                    required
                />
            </div>

            <FormField
                label="Description"
                name="EventDescription"
                type="textarea"
                value={formData.EventDescription}
                onChange={handleChange}
                placeholder="What is this event about?"
                required
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 xl:py-5 flex items-center justify-center gap-3 mt-10 disabled:opacity-50 shadow-xl shadow-primary/20 text-lg"
            >
                {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={22} /> Launch Event</>}
            </button>
        </form>
    );

    if (isModal) return formContent;

    return (
        <div className="container mx-auto px-6 py-12 flex justify-center">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-display font-bold text-white mb-4">Create Event</h1>
                    <p className="text-gray-400">Design a new competition or activity for the fest.</p>
                </div>
                <div className="glass-dark p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    {formContent}
                </div>
            </div>
        </div>
    );
};

export default AddEvent;
