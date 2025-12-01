// Indian States and Cities Data
export const indianStatesCities: { [key: string]: string[] } = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Kakinada", "Kadapa", "Anantapur"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Tawang", "Pasighat", "Ziro", "Bomdila", "Tezu", "Daporijo"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Dhubri", "Sivasagar"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", "Arrah", "Begusarai", "Katihar"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Durg", "Korba", "Rajnandgaon", "Raigarh", "Jagdalpur", "Ambikapur", "Chirmiri"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Mormugao"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Gandhidham", "Anand"],
  "Haryana": ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula"],
  "Himachal Pradesh": ["Shimla", "Mandi", "Solan", "Dharamshala", "Bilaspur", "Kullu", "Chamba", "Hamirpur", "Una", "Nahan"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Hazaribagh", "Deoghar", "Giridih", "Phusro", "Adityapur", "Hazaribag"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davangere", "Bellary", "Bijapur", "Raichur"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Alappuzha", "Kannur", "Kottayam", "Palakkad", "Malappuram"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Gwalior", "Jabalpur", "Raipur", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Sangli"],
  "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Ukhrul", "Senapati"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh", "Williamnagar", "Baghmara"],
  "Mizoram": ["Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib", "Serchhip"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Baleshwar", "Bhadrak", "Baripada", "Jharsuguda"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Pathankot", "Hoshiarpur", "Mohali", "Batala", "Moga"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Bharatpur", "Sikar"],
  "Sikkim": ["Gangtok", "Namchi", "Mangan", "Gyalshing", "Singtam"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam", "Khammam", "Mahbubnagar", "Nalgonda", "Adilabad", "Siddipet"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Belonia", "Khowai"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad", "Meerut", "Ghaziabad", "Noida", "Bareilly", "Aligarh"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Nainital", "Almora", "Pithoragarh"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda", "Kharagpur", "Haldia", "Raiganj"]
};

export const indianStates = Object.keys(indianStatesCities).sort();

// Validate Indian pincode (6 digits)
export const validatePincode = (pincode: string): boolean => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};


