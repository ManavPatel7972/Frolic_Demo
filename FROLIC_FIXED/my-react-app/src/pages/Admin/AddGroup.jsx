import React, { useState } from 'react';
import FormPageLayout from '../../components/Form/FormPageLayout';
import FormField from '../../components/Form/FormField';
import { Send, CheckCircle, Users } from 'lucide-react';

const AddGroup = () => {
    const [formData, setFormData] = useState({ groupName: '', eventId: '', leaderEmail: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const events = [
        { label: 'Code-A-Thon', value: '1' },
        { label: 'Robo Race', value: '2' },
        { label: 'Brand Cop', value: '3' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.groupName.trim()) tempErrors.groupName = "Group name is required";
        if (!formData.eventId) tempErrors.eventId = "Please select an event";
        if (!formData.leaderEmail.trim()) {
            tempErrors.leaderEmail = "Leader email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.leaderEmail)) {
            tempErrors.leaderEmail = "Invalid email format";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log("Submitting Group Data:", formData);
            setIsSubmitted(true);
            setTimeout(() => setIsSubmitted(false), 3000);
            setFormData({ groupName: '', eventId: '', leaderEmail: '' });
        }
    };

    return (
        <FormPageLayout title="Register Group" subtitle="Create a team for collaborative event participation.">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        label="Team Name"
                        name="groupName"
                        value={formData.groupName}
                        onChange={handleChange}
                        error={errors.groupName}
                        placeholder="e.g. Pixel Pioneers"
                        required
                    />

                    <FormField
                        label="Select Event"
                        name="eventId"
                        type="select"
                        value={formData.eventId}
                        onChange={handleChange}
                        error={errors.eventId}
                        options={events}
                        required
                    />
                </div>

                <FormField
                    label="Team Leader Email Address"
                    name="leaderEmail"
                    type="email"
                    value={formData.leaderEmail}
                    onChange={handleChange}
                    error={errors.leaderEmail}
                    placeholder="leader@university.edu"
                    required
                />

                <button type="submit" className="w-full btn-primary py-4 flex items-center justify-center gap-3 mt-10 shadow-xl shadow-primary/20 text-lg">
                    {isSubmitted ? <><CheckCircle size={22} /> Group Registered!</> : <><Users size={22} /> Register Team</>}
                </button>
            </form>
        </FormPageLayout>
    );
};

export default AddGroup;
