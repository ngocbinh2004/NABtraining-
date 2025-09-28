const calculateAge = (birthDate: string | Date): number | null => {
  try {
    const dob = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    
    if (isNaN(dob.getTime())) {
      throw new Error('birthDate is not a valid date');
    }

    const currentDate = new Date();
    let age = currentDate.getFullYear() - dob.getFullYear();
    
    const hasBirthdayPassed =
      currentDate.getMonth() > dob.getMonth() ||
      (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() >= dob.getDate());
    
    if (!hasBirthdayPassed) {
      age--;
    }

    if (age < 0) {
      throw new Error('birthDate cannot be greater than current date');
    }

    return age;
  } catch (error) {
    console.error('Failed to calculate age:', error);
    return null;
  }
};

export default calculateAge;