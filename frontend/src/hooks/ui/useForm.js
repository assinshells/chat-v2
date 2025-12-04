// frontend/src/hooks/ui/useForm.js - Универсальный хук для форм
export const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));

      if (touched[name] && validate) {
        const fieldErrors = validate({ ...values, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
      }
    },
    [values, touched, validate]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      if (validate) {
        const fieldErrors = validate(values);
        setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
      }
    },
    [values, validate]
  );

  const handleSubmit = useCallback(
    (onSubmit) => {
      return (e) => {
        e.preventDefault();

        if (validate) {
          const validationErrors = validate(values);
          setErrors(validationErrors);

          if (Object.keys(validationErrors).length === 0) {
            onSubmit(values);
          }
        } else {
          onSubmit(values);
        }
      };
    },
    [values, validate]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
  };
};
