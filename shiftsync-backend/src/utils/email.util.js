import transporter from '../config/email.config.js';

const FROM = process.env.SMTP_FROM || 'ShiftSync <no-reply@shiftsync.com>';

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: FROM,
      to,
      subject,
      html,
    });
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Email send error:', error.message);
  }
};

export const bookingConfirmedEmail = ({ workerName, workerEmail, shiftTitle, shiftDate, startTime, endTime, facilityName }) => ({
  to: workerEmail,
  subject: `Booking Confirmed — ${shiftTitle}`,
  html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);border-radius:12px;padding:30px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:24px;">✅ Booking Confirmed</h1>
      </div>
      <div style="padding:30px;background:#f8fafc;border-radius:0 0 12px 12px;">
        <p style="color:#334155;font-size:16px;">Hi <strong>${workerName}</strong>,</p>
        <p style="color:#64748b;">Your booking has been confirmed by <strong>${facilityName}</strong>.</p>
        <div style="background:white;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:20px 0;">
          <p style="margin:8px 0;color:#334155;"><strong>Shift:</strong> ${shiftTitle}</p>
          <p style="margin:8px 0;color:#334155;"><strong>Date:</strong> ${shiftDate}</p>
          <p style="margin:8px 0;color:#334155;"><strong>Time:</strong> ${startTime} - ${endTime}</p>
          <p style="margin:8px 0;color:#334155;"><strong>Facility:</strong> ${facilityName}</p>
        </div>
        <p style="color:#64748b;font-size:14px;">Please arrive 15 minutes before your shift starts.</p>
        <p style="color:#94a3b8;font-size:12px;margin-top:30px;">ShiftSync — Healthcare Shift Scheduling</p>
      </div>
    </div>
  `,
});

export const bookingRejectedEmail = ({ workerName, workerEmail, shiftTitle, shiftDate, facilityName }) => ({
  to: workerEmail,
  subject: `Booking Rejected — ${shiftTitle}`,
  html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:linear-gradient(135deg,#ef4444,#f97316);border-radius:12px;padding:30px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:24px;">❌ Booking Rejected</h1>
      </div>
      <div style="padding:30px;background:#f8fafc;border-radius:0 0 12px 12px;">
        <p style="color:#334155;font-size:16px;">Hi <strong>${workerName}</strong>,</p>
        <p style="color:#64748b;">Unfortunately, your booking for <strong>${shiftTitle}</strong> at <strong>${facilityName}</strong> has been rejected.</p>
        <div style="background:white;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:20px 0;">
          <p style="margin:8px 0;color:#334155;"><strong>Shift:</strong> ${shiftTitle}</p>
          <p style="margin:8px 0;color:#334155;"><strong>Date:</strong> ${shiftDate}</p>
          <p style="margin:8px 0;color:#334155;"><strong>Facility:</strong> ${facilityName}</p>
        </div>
        <p style="color:#64748b;font-size:14px;">You can browse other available shifts on the platform.</p>
        <p style="color:#94a3b8;font-size:12px;margin-top:30px;">ShiftSync — Healthcare Shift Scheduling</p>
      </div>
    </div>
  `,
});

export const bookingCancelledEmail = ({ recipientName, recipientEmail, shiftTitle, shiftDate, facilityName, cancelledBy }) => ({
  to: recipientEmail,
  subject: `Booking Cancelled — ${shiftTitle}`,
  html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:linear-gradient(135deg,#f59e0b,#ef4444);border-radius:12px;padding:30px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:24px;">⚠️ Booking Cancelled</h1>
      </div>
      <div style="padding:30px;background:#f8fafc;border-radius:0 0 12px 12px;">
        <p style="color:#334155;font-size:16px;">Hi <strong>${recipientName}</strong>,</p>
        <p style="color:#64748b;">The booking for <strong>${shiftTitle}</strong> has been cancelled by <strong>${cancelledBy}</strong>.</p>
        <div style="background:white;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:20px 0;">
          <p style="margin:8px 0;color:#334155;"><strong>Shift:</strong> ${shiftTitle}</p>
          <p style="margin:8px 0;color:#334155;"><strong>Date:</strong> ${shiftDate}</p>
          <p style="margin:8px 0;color:#334155;"><strong>Facility:</strong> ${facilityName}</p>
        </div>
        <p style="color:#94a3b8;font-size:12px;margin-top:30px;">ShiftSync — Healthcare Shift Scheduling</p>
      </div>
    </div>
  `,
});

export const shiftReminderEmail = ({ workerName, workerEmail, shiftTitle, shiftDate, startTime, endTime, facilityName, facilityAddress }) => ({
  to: workerEmail,
  subject: `⏰ Shift Reminder — ${shiftTitle} in 30 minutes`,
  html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:linear-gradient(135deg,#06b6d4,#3b82f6);border-radius:12px;padding:30px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:24px;">⏰ Shift Reminder</h1>
        <p style="color:rgba(255,255,255,0.9);margin:10px 0 0 0;">Your shift starts in 30 minutes</p>
      </div>
      <div style="padding:30px;background:#f8fafc;border-radius:0 0 12px 12px;">
        <p style="color:#334155;font-size:16px;">Hi <strong>${workerName}</strong>,</p>
        <p style="color:#64748b;">This is a reminder that your shift starts in <strong>30 minutes</strong>.</p>
        <div style="background:white;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:20px 0;">
          <p style="margin:8px 0;color:#334155;"><strong>Shift:</strong> ${shiftTitle}</p>
          <p style="margin:8px 0;color:#334155;"><strong>Date:</strong> ${shiftDate}</p>
          <p style="margin:8px 0;color:#334155;"><strong>Time:</strong> ${startTime} - ${endTime}</p>
          <p style="margin:8px 0;color:#334155;"><strong>Facility:</strong> ${facilityName}</p>
          <p style="margin:8px 0;color:#334155;"><strong>Address:</strong> ${facilityAddress}</p>
        </div>
        <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:15px;margin:20px 0;">
          <p style="color:#92400e;font-size:14px;margin:0;"><strong>⚡ Reminder:</strong> Please arrive 15 minutes early and bring your ID badge.</p>
        </div>
        <p style="color:#94a3b8;font-size:12px;margin-top:30px;">ShiftSync — Healthcare Shift Scheduling</p>
      </div>
    </div>
  `,
});

export const newShiftEmail = ({ workerName, workerEmail, shiftTitle, shiftDate, startTime, endTime, payRate, facilityName }) => ({
  to: workerEmail,
  subject: `🆕 New Shift Available — ${shiftTitle}`,
  html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:linear-gradient(135deg,#22c55e,#06b6d4);border-radius:12px;padding:30px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:24px;">🆕 New Shift Available</h1>
      </div>
      <div style="padding:30px;background:#f8fafc;border-radius:0 0 12px 12px;">
        <p style="color:#334155;font-size:16px;">Hi <strong>${workerName}</strong>,</p>
        <p style="color:#64748b;">A new shift matching your specialization is available at <strong>${facilityName}</strong>.</p>
        <div style="background:white;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:20px 0;">
          <p style="margin:8px 0;color:#334155;"><strong>Shift:</strong> ${shiftTitle}</p>
          <p style="margin:8px 0;color:#334155;"><strong>Date:</strong> ${shiftDate}</p>
          <p style="margin:8px 0;color:#334155;"><strong>Time:</strong> ${startTime} - ${endTime}</p>
          <p style="margin:8px 0;color:#22c55e;font-size:18px;"><strong>Pay:</strong> $${payRate}/hr</p>
        </div>
        <p style="color:#64748b;font-size:14px;">Log in to claim this shift before it's taken!</p>
        <p style="color:#94a3b8;font-size:12px;margin-top:30px;">ShiftSync — Healthcare Shift Scheduling</p>
      </div>
    </div>
  `,
});
