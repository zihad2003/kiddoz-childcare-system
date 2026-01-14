import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'kiddoz_enrollment_state';

const INITIAL_STATE = {
    plan: null,
    childData: {
        name: '',
        age: '',
        gender: '',
        allergies: '',
        dietaryRestrictions: '',
        medicalConditions: '',
        doctorName: '',
        doctorPhone: '',
        parentName: '',
        phone: '',
        emergencyName: '',
        emergencyPhone: ''
    },
    biometrics: {
        face: null,
        body: null
    },
    visitedSteps: ['/enroll']
};

export const useEnrollmentForm = () => {
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [errors, setErrors] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setFormData(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error("Failed to load enrollment state", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        }
    }, [formData, isLoaded]);

    const updateFormData = useCallback((section, data) => {
        setFormData(prev => {
            const newData = { ...prev };
            if (section === 'root') {
                Object.assign(newData, data);
            } else {
                newData[section] = { ...newData[section], ...data };
            }
            return newData;
        });
    }, []);

    const markStepVisited = useCallback((path) => {
        setFormData(prev => {
            if (prev.visitedSteps.includes(path)) return prev;
            return { ...prev, visitedSteps: [...prev.visitedSteps, path] };
        });
    }, []);

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 'student-info') {
            const required = ['name', 'age', 'gender', 'parentName', 'phone', 'emergencyName', 'emergencyPhone'];
            required.forEach(field => {
                if (!formData.childData[field] || formData.childData[field].trim() === '') {
                    newErrors[field] = 'This field is required';
                    isValid = false;
                }
            });
        }

        if (step === 'plan') {
            if (!formData.plan) {
                newErrors['plan'] = 'Please select a plan';
                isValid = false;
            }
        }

        setErrors(prev => ({ ...prev, ...newErrors }));
        return isValid;
    };

    const clearForm = () => {
        setFormData(INITIAL_STATE);
        localStorage.removeItem(STORAGE_KEY);
    };

    return {
        formData,
        updateFormData,
        errors,
        validateStep,
        markStepVisited,
        clearForm,
        isLoaded
    };
};
