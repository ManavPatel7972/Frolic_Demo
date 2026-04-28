import { useState, useEffect } from 'react';
import FormPageLayout from '../../components/Form/FormPageLayout';
import FormField from '../../components/Form/FormField';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { departmentService, instituteService, userService } from '../../services/api';

const AddDepartment = () => {
    const [formData, setFormData] = useState({ 
        DepartmentName: '', 
        DepartmentImage: 'Laptop', 
        DepartmentDescription: '',
        InstituteID: '',
        DepartmentCoOrdinatorID: ''
    });
    const [institutes, setInstitutes] = useState([]);
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoadingData(true);
            try {
                const [instData, userData] = await Promise.all([
                    instituteService.getAll().catch(err => {
                        console.error("Inst fetch failed", err);
                        return [];
                    }),
                    userService.getAll().catch(err => {
                        console.error("User fetch failed", err);
                        return [];
                    })
                ]);
                
                if (Array.isArray(instData)) {
                    setInstitutes(instData.map(i => ({ label: i.InstituteName, value: i._id })));
                }
                
                if (Array.isArray(userData)) {
                    setUsers(userData.map(u => ({ label: `${u.UserName} (${u.EmailAddress})`, value: u._id })));
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
        if (!formData.DepartmentName.trim()) tempErrors.DepartmentName = "Department name is required";
        if (!formData.DepartmentCoOrdinatorID) tempErrors.DepartmentCoOrdinatorID = "Co-ordinator is required";
        if (!formData.InstituteID) tempErrors.InstituteID = "Please select an institute";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            try {
                await departmentService.create(formData);
                setIsSubmitted(true);
                setTimeout(() => setIsSubmitted(false), 3000);
                setFormData({ DepartmentName: '', DepartmentImage: 'Laptop', DepartmentDescription: '', InstituteID: '', DepartmentCoOrdinatorID: '' });
            } catch (err) {
                setErrors({ submit: err.response?.data?.message || "Failed to save department" });
            } finally {
                setLoading(false);
            }
        }
    };

    const iconOptions = [
        { label: 'Laptop', value: 'Laptop' },
        { label: 'Settings', value: 'Settings' },
        { label: 'Building', value: 'Building' },
        { label: 'Zap', value: 'Zap' },
        { label: 'Briefcase', value: 'Briefcase' },
        { label: 'Palette', value: 'Palette' },
        { label: 'Users', value: 'Users' }
    ];

    return (
        <FormPageLayout title="Add Department" subtitle="Create a new academic department within an institute.">
            {errors.submit && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 text-sm">
                    {errors.submit}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        label="Institute"
                        name="InstituteID"
                        type="select"
                        value={formData.InstituteID}
                        onChange={handleChange}
                        error={errors.InstituteID}
                        options={institutes}
                        placeholder={loadingData ? "Loading institutes..." : institutes.length === 0 ? "No institutes found (Seed DB)" : "Select Institute"}
                        required
                    />

                    <FormField
                        label="Department Icon"
                        name="DepartmentImage"
                        type="select"
                        value={formData.DepartmentImage}
                        onChange={handleChange}
                        options={iconOptions}
                        required
                    />
                </div>

                <FormField
                    label="Department Name"
                    name="DepartmentName"
                    value={formData.DepartmentName}
                    onChange={handleChange}
                    error={errors.DepartmentName}
                    placeholder="e.g. Computer Engineering"
                    required
                />

                <FormField
                    label="Co-ordinator"
                    name="DepartmentCoOrdinatorID"
                    type="select"
                    value={formData.DepartmentCoOrdinatorID}
                    onChange={handleChange}
                    error={errors.DepartmentCoOrdinatorID}
                    options={users}
                    placeholder={loadingData ? "Loading coordinators..." : users.length === 0 ? "No coordinators found (Seed DB)" : "Select a coordinator"}
                    required
                />

                <FormField
                    label="Description"
                    name="DepartmentDescription"
                    type="textarea"
                    value={formData.DepartmentDescription}
                    onChange={handleChange}
                    placeholder="About this department..."
                />

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full btn-primary py-4 flex items-center justify-center gap-3 mt-10 disabled:opacity-50 shadow-xl shadow-primary/20 text-lg"
                >
                    {loading ? <Loader2 className="animate-spin" /> : isSubmitted ? <><CheckCircle size={22} /> Success!</> : <><Send size={22} /> Save Department</>}
                </button>
            </form>
        </FormPageLayout>
    );
};

export default AddDepartment;
