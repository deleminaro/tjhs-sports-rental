// Email notification service for overdue rentals
// Note: This is a client-side implementation for demonstration
// In a real application, you would use a server-side email service

export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  rentalId: string;
  studentName: string;
  equipmentName: string;
  dueDate: Date;
}

export class EmailService {
  private static instance: EmailService;
  private notifications: EmailNotification[] = [];

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Simulate sending an email notification
  async sendOverdueNotification(notification: EmailNotification): Promise<boolean> {
    try {
      // In a real application, this would send an actual email
      // For now, we'll store it locally and log it
      this.notifications.push(notification);
      
      console.log('📧 Email notification sent:', {
        to: notification.to,
        subject: notification.subject,
        rentalId: notification.rentalId
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Failed to send email notification:', error);
      return false;
    }
  }

  // Get all sent notifications (for admin view)
  getNotifications(): EmailNotification[] {
    return [...this.notifications];
  }

  // Clear notifications (for testing)
  clearNotifications(): void {
    this.notifications = [];
  }

  // Generate email content for overdue rental
  generateOverdueEmail(
    studentEmail: string,
    studentName: string,
    equipmentName: string,
    rentalId: string,
    dueDate: Date
  ): EmailNotification {
    const subject = `URGENT: Overdue Equipment Return - ${equipmentName}`;
    const body = `
Dear ${studentName},

This is a reminder that you have an overdue equipment rental that needs to be returned immediately.

Rental Details:
- Equipment: ${equipmentName}
- Rental ID: ${rentalId}
- Due Date: ${dueDate.toLocaleDateString()} at ${dueDate.toLocaleTimeString()}
- Current Status: OVERDUE

Please return the equipment to the sports office as soon as possible. Continued failure to return equipment may result in restrictions on future rentals.

If you have already returned the equipment, please contact the sports office to update your rental status.

Thank you for your cooperation.

Best regards,
TJHS Sports Department
The Jannali High School
    `.trim();

    return {
      to: studentEmail,
      subject,
      body,
      rentalId,
      studentName,
      equipmentName,
      dueDate
    };
  }
}

// Utility function to check for overdue rentals and send notifications
export async function checkAndSendOverdueNotifications(
  overdueRentals: any[],
  users: any[]
): Promise<void> {
  const emailService = EmailService.getInstance();
  
  for (const rental of overdueRentals) {
    const user = users.find(u => u.id === rental.userId);
    if (!user || !user.email) continue;

    // Check if we've already sent a notification for this rental today
    const today = new Date().toDateString();
    const existingNotification = emailService.getNotifications().find(
      n => n.rentalId === rental.id && 
           new Date(n.dueDate).toDateString() === today
    );

    if (!existingNotification) {
      const notification = emailService.generateOverdueEmail(
        user.email,
        user.name,
        rental.equipmentName,
        rental.id,
        new Date(rental.dueDate)
      );

      await emailService.sendOverdueNotification(notification);
    }
  }
}
