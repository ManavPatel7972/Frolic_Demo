import { useState, useEffect } from 'react';
import FormPageLayout from '../../components/Form/FormPageLayout';
import FormField from '../../components/Form/FormField';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { instituteService, userService } from '../../services/api';

const AddInstitute = () => {
    const [formData, setFormData] = useState({ 
        InstituteName: '', 
        InstituteDescription: '',
        InstituteCoOrdinatorID: ''
    });
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await userService.getAll();
                setUsers(data.map(u => ({ label: `${u.UserName} (${u.EmailAddress})`, value: u._id })));
            } catch (err) {
                console.error("Failed to fetch users", err);
            }
        };
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.InstituteName.trim()) tempErrors.InstituteName = "Institute name is required";
        if (!formData.InstituteCoOrdinatorID) tempErrors.InstituteCoOrdinatorID = "Co-ordinator is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            try {
                await instituteService.create(formData);
                setIsSubmitted(true);
                setTimeout(() => setIsSubmitted(false), 3000);
                setFormData({ InstituteName: '', InstituteDescription: '', InstituteCoOrdinatorID: '' });
            } catch (err) {
                setErrors({ submit: err.response?.data?.message || "Failed to save institute" });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <FormPageLayout title="Add Institute" subtitle="Register a new participating university in the Frolic ecosystem.">
            {errors.submit && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 text-sm">
                    {errors.submit}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <FormField
                    label="Institute Name"
                    name="InstituteName"
                    value={formData.InstituteName}
                    onChange={handleChange}
                    error={errors.InstituteName}
                    placeholder="e.g. Darshan University"
                    required
                />

                <FormField
                    label="Co-ordinator"
                    name="InstituteCoOrdinatorID"
                    type="select"
                    value={formData.InstituteCoOrdinatorID}
                    onChange={handleChange}
                    error={errors.InstituteCoOrdinatorID}
                    options={users}
                    placeholder="Select a coordinator"
                    required
                />


                <FormField
                    label="Description"
                    name="InstituteDescription"
                    type="textarea"
                    value={formData.InstituteDescription}
                    onChange={handleChange}
                    placeholder="Briefly describe the university..."
                />

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full btn-primary py-4 flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" /> : isSubmitted ? <><CheckCircle size={20} /> Success!</> : <><Send size={20} /> Save Institute</>}
                </button>
            </form>
        </FormPageLayout>
    );
};

export default AddInstitute;
