function validateParkingInput(input) {
  const errors = []
  
  if (!input.name) errors.push('Name is required')
  if (!input.address) errors.push('Address is required')
  if (input.total_slots <= 0) errors.push('Total slots must be positive')
  if (!input.hourly_rate) errors.push('Hourly rate is required')
  if (input.hourly_rate <= 0) errors.push('Hourly rate must be positive')
  if (input.name && input.name.length > 100) errors.push('Name too long')

  return {
    isValid: errors.length === 0,
    errors
  }
}

function validateSlotInput(input) {
  const errors = [];
  
  if (!input.slot_number) errors.push('Slot number is required');
  if (input.slot_number <= 0) errors.push('Slot number must be positive');

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateParkingInput,
  validateSlotInput
}