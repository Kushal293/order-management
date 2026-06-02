import { useState } from 'react';

const CheckoutForm = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 100) return 'Name is too long';
        return '';
      case 'address':
        if (!value.trim()) return 'Delivery address is required';
        if (value.trim().length < 5) return 'Please enter a complete address';
        if (value.trim().length > 300) return 'Address is too long';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/.test(value.trim())) {
          return 'Please enter a valid phone number';
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({ name: true, address: true, phone: true });

    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        name: formData.name.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" id="checkout-form">
      <h3 className="text-lg font-bold text-surface-900 mb-1">
        Delivery Details
      </h3>
      <p className="text-sm text-surface-500 mb-5">
        Please enter your delivery information
      </p>

      {/* Name */}
      <div>
        <label htmlFor="customer-name" className="input-label">
          Full Name
        </label>
        <input
          type="text"
          id="customer-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="John Doe"
          className={`input ${errors.name && touched.name ? 'error' : ''}`}
          disabled={isSubmitting}
        />
        {errors.name && touched.name && (
          <p className="input-error">{errors.name}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label htmlFor="customer-address" className="input-label">
          Delivery Address
        </label>
        <textarea
          id="customer-address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="123 Main Street, Apt 4B, New York, NY 10001"
          rows={3}
          className={`input resize-none ${errors.address && touched.address ? 'error' : ''}`}
          disabled={isSubmitting}
        />
        {errors.address && touched.address && (
          <p className="input-error">{errors.address}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="customer-phone" className="input-label">
          Phone Number
        </label>
        <input
          type="tel"
          id="customer-phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="(123) 456-7890"
          className={`input ${errors.phone && touched.phone ? 'error' : ''}`}
          disabled={isSubmitting}
        />
        {errors.phone && touched.phone && (
          <p className="input-error">{errors.phone}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full btn btn-primary btn-lg mt-6"
        disabled={isSubmitting}
        id="place-order-btn"
      >
        {isSubmitting ? (
          <>
            <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Placing Order...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Place Order
          </>
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;
