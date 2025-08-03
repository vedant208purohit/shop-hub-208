// Email validation
export const validateEmail = (email: string): { isValid: boolean; message: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  return { isValid: true, message: '' };
};

// Password strength validation
export const validatePassword = (password: string): { isValid: boolean; message: string; strength: 'weak' | 'medium' | 'strong' } => {
  if (!password) {
    return { isValid: false, message: 'Password is required', strength: 'weak' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long', strength: 'weak' };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const strengthScore = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
  
  if (strengthScore < 3) {
    return { isValid: false, message: 'Password must contain uppercase, lowercase, number, and special character', strength: 'weak' };
  }
  
  if (strengthScore === 3) {
    return { isValid: true, message: 'Password strength: Medium', strength: 'medium' };
  }
  
  return { isValid: true, message: 'Password strength: Strong', strength: 'strong' };
};

// Name validation
export const validateName = (name: string): { isValid: boolean; message: string } => {
  if (!name) {
    return { isValid: false, message: 'Name is required' };
  }
  
  if (name.length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long' };
  }
  
  if (name.length > 50) {
    return { isValid: false, message: 'Name must be less than 50 characters' };
  }
  
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, message: 'Name can only contain letters and spaces' };
  }
  
  return { isValid: true, message: '' };
};

// Phone number validation
export const validatePhone = (phone: string): { isValid: boolean; message: string } => {
  if (!phone) {
    return { isValid: false, message: 'Phone number is required' };
  }
  
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { isValid: false, message: 'Please enter a valid phone number' };
  }
  
  return { isValid: true, message: '' };
};

// Address validation
export const validateAddress = (address: string): { isValid: boolean; message: string } => {
  if (!address) {
    return { isValid: false, message: 'Address is required' };
  }
  
  if (address.length < 10) {
    return { isValid: false, message: 'Address must be at least 10 characters long' };
  }
  
  if (address.length > 200) {
    return { isValid: false, message: 'Address must be less than 200 characters' };
  }
  
  return { isValid: true, message: '' };
};

// Age validation
export const validateAge = (birthDate: string): { isValid: boolean; message: string } => {
  if (!birthDate) {
    return { isValid: false, message: 'Date of birth is required' };
  }
  
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  if (age < 13) {
    return { isValid: false, message: 'You must be at least 13 years old to register' };
  }
  
  if (age > 120) {
    return { isValid: false, message: 'Please enter a valid date of birth' };
  }
  
  return { isValid: true, message: '' };
};

// Credit card validation
export const validateCreditCard = (cardNumber: string): { isValid: boolean; message: string } => {
  if (!cardNumber) {
    return { isValid: false, message: 'Card number is required' };
  }
  
  const cleanNumber = cardNumber.replace(/\s/g, '');
  const cardRegex = /^[0-9]{13,19}$/;
  
  if (!cardRegex.test(cleanNumber)) {
    return { isValid: false, message: 'Please enter a valid card number' };
  }
  
  // Luhn algorithm for card validation
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i));
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  if (sum % 10 !== 0) {
    return { isValid: false, message: 'Invalid card number' };
  }
  
  return { isValid: true, message: '' };
};

// CVV validation
export const validateCVV = (cvv: string): { isValid: boolean; message: string } => {
  if (!cvv) {
    return { isValid: false, message: 'CVV is required' };
  }
  
  const cvvRegex = /^[0-9]{3,4}$/;
  if (!cvvRegex.test(cvv)) {
    return { isValid: false, message: 'CVV must be 3 or 4 digits' };
  }
  
  return { isValid: true, message: '' };
};

// Expiry date validation
export const validateExpiryDate = (expiryDate: string): { isValid: boolean; message: string } => {
  if (!expiryDate) {
    return { isValid: false, message: 'Expiry date is required' };
  }
  
  const [month, year] = expiryDate.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  
  const expMonth = parseInt(month);
  const expYear = parseInt(year);
  
  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return { isValid: false, message: 'Card has expired' };
  }
  
  return { isValid: true, message: '' };
}; 