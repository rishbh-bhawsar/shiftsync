export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((h) => {
        let val = row[h];
        if (val === null || val === undefined) val = '';
        if (typeof val === 'object') val = JSON.stringify(val);
        val = String(val).replace(/"/g, '""');
        return `"${val}"`;
      }).join(',')
    ),
  ];

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const shiftToCSVRow = (shift) => ({
  Title: shift.title,
  Facility: shift.facilityName,
  Specialization: shift.specialization,
  Date: shift.date,
  'Start Time': shift.startTime,
  'End Time': shift.endTime,
  'Duration (hrs)': shift.durationHours,
  'Pay Rate ($/hr)': shift.payRate,
  'Total Pay': shift.totalPay,
  'Required Workers': shift.requiredWorkers,
  'Claimed Count': shift.claimedCount,
  Status: shift.status,
  Address: shift.facilityAddress,
  Description: shift.description || '',
});

export const bookingToCSVRow = (booking) => ({
  'Shift Title': booking.shift?.title || '',
  Worker: booking.worker?.name || '',
  Facility: booking.shift?.facilityName || '',
  Date: booking.shift?.date || '',
  Time: booking.shift ? `${booking.shift.startTime} - ${booking.shift.endTime}` : '',
  Status: booking.status,
  'Actual Hours': booking.actualHours || '',
  'Total Earned': booking.totalEarned || '',
});
