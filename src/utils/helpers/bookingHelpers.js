// src/utils/helpers/bookingHelpers.js

function generateBookingCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// fungsi untuk validasi waktu
function validateBookingTime(date, time) {
  const [year, month, day] = date.split('-');
  const [hours, minutes] = time.split(':');
  const reserveTime = new Date(year, month - 1, day, hours, minutes);
  const now = new Date();
  
  if (reserveTime < now) {
    throw new Error('Booking time cannot be in the past');
  }
  
  return reserveTime;
}

function validateBookingTime(date, time) {
  // Tambahkan zona waktu +07:00 (WIB)
  const reserveTime = new Date(`${date}T${time}:00+07:00`);
  const now = new Date();

  console.log(">> date:", date);
  console.log(">> time:", time);
  console.log(">> reserveTime:", reserveTime);
  console.log(">> now:", now);

  if (reserveTime < now) {
    throw new Error('Booking time cannot be in the past');
  }

  return reserveTime;
}



module.exports = {
  generateBookingCode,
  validateBookingTime
};