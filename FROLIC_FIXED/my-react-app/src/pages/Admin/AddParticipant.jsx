import React, { useState } from 'react';
import FormPageLayout from '../../components/Form/FormPageLayout';
import FormField from '../../components/Form/FormField';
import { Send, CheckCircle, UserPlus } from 'lucide-react';

const AddParticipant = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        college: '',
        role: 'Participant'
    });
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const roles = [
        { label: 'Participant', value: 'Participant' },
        { label: 'Volunteer', value: 'Volunteer' },
        { label: 'Coordinator', value: 'Coordinator' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.fullName.trim()) tempErrors.fullName = "Full name is required";
        if (!formData.college.trim()) tempErrors.college = "College name is required";
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            tempErrors.email = "Valid email is required";
        }
        if (!formData.phone.trim() || formData.phone.length < 10) {
            tempErrors.phone = "Valid 10-digit phone number is required";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log("Submitting Participant Data:", formData);
            setIsSubmitted(true);
            setTimeout(() => setIsSubmitted(false), 3000);
            setFormData({ fullName: '', email: '', phone: '', college: '', role: 'Participant' });
        }
    };

    return (
        <FormPageLayout title="Add Participant" subtitle="Register an individual student for the festival.">
            <form onSubmit={handleSubmit} className="space-y-6">
                <FormField
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={errors.fullName}
                    placeholder="e.g. Alex Johnson"
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="alex@example.com"
                        required
                    />

                    <FormField
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        placeholder="10 digit number"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        label="College / Organization"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        error={errors.college}
                        placeholder="e.g. Darshan University"
                        required
                    />

                    <FormField
                        label="Registration Role"
                        name="role"
                        type="select"
                        value={formData.role}
                        onChange={handleChange}
                        options={roles}
                        required
                    />
                </div>

                <button type="submit" className="w-full btn-primary py-4 flex items-center justify-center gap-3 mt-10 shadow-xl shadow-primary/20 text-lg">
                    {isSubmitted ? <><CheckCircle size={22} /> Registered!</> : <><UserPlus size={22} /> Add Participant</>}
                </button>
            </form>
        </FormPageLayout>
    );
};

export default AddParticipant;
