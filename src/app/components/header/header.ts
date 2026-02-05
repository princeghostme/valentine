import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  // Time and Date
  currentTime: string = '00:00';
  currentTimeAMPM: string = 'AM';
  currentDate: string = 'Jan 1';
  currentDay: string = 'Monday';

  // Countdown
  daysToValentine: number = 0;
  hoursToValentine: number = 0;
  minutesToValentine: number = 0;
  isValentineToday: boolean = false;

  // Notifications
  showNotification: boolean = false;
  showSpecialNotification: boolean = false;
  specialNotificationMessage: string = '';
  showNotificationPopupFlag: boolean = false;

  // Responsive
  isMobileView: boolean = false;

  private timerInterval: any;
  private notificationCheckInterval: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.updateDateTime();
    this.updateValentineCountdown();
    this.checkSpecialDates();

    // Update time every second
    this.timerInterval = setInterval(() => {
      this.updateDateTime();
    }, 1000);

    // Check notifications every minute
    this.notificationCheckInterval = setInterval(() => {
      this.updateValentineCountdown();
      this.checkSpecialDates();
      this.checkNotification();
    }, 60000);

    // Initial notification check
    this.checkNotification();
  }

  updateDateTime(): void {
    const now = new Date();

    // Update time
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12;

    this.currentTime = `${this.formatTime(hours)}:${this.formatTime(minutes)}`;
    this.currentTimeAMPM = ampm;

    // Update date
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric'
    };
    this.currentDate = now.toLocaleDateString('en-US', options);

    // Update day
    const dayOptions: Intl.DateTimeFormatOptions = { weekday: 'short' };
    this.currentDay = now.toLocaleDateString('en-US', dayOptions);
  }

  updateValentineCountdown(): void {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Valentine's Day (February 14th)
    let valentineDate = new Date(currentYear, 1, 14);

    // Check if today is Valentine's Day
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const valentineDay = new Date(valentineDate.getFullYear(), valentineDate.getMonth(), valentineDate.getDate());

    this.isValentineToday = today.getTime() === valentineDay.getTime();

    // If Valentine's Day has passed this year, calculate for next year
    if (now > valentineDate && !this.isValentineToday) {
      valentineDate = new Date(currentYear + 1, 1, 14);
    }

    // Calculate time difference
    const diffMs = valentineDate.getTime() - now.getTime();
    this.daysToValentine = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    this.hoursToValentine = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutesToValentine = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    // Update notification status
    this.checkNotification();
  }

  checkSpecialDates(): void {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    const day = now.getDate();

    // Check for special dates
    if (month === 2 && day === 14) {
      this.specialNotificationMessage = "🎉 Happy Valentine's Day! Spread love everywhere! 💖";
      this.showSpecialNotification = true;
    } else if (month === 2 && day >= 7 && day <= 13) {
      const daysLeft = 14 - day;
      this.specialNotificationMessage = `Only ${daysLeft} day${daysLeft === 1 ? '' : 's'} until Valentine's! 💝`;
      this.showSpecialNotification = true;
    } else if (month === 2 && day === 1) {
      this.specialNotificationMessage = "February is the month of love! 💘 Valentine's is coming soon!";
      this.showSpecialNotification = true;
    } else if (month === 1 && day >= 25) {
      const daysLeft = 14 + (31 - day);
      this.specialNotificationMessage = `${daysLeft} days until Valentine's! 💕`;
      this.showSpecialNotification = true;
    } else {
      this.showSpecialNotification = false;
    }
  }

  checkNotification(): void {
    // Show notification if Valentine's is within 14 days
    this.showNotification = this.daysToValentine <= 14 && this.daysToValentine >= 0;
  }

  getCountdownMessage(): string {
    if (this.isValentineToday) {
      return "🎉 It's Valentine's Day Today! Celebrate love! 💖";
    } else if (this.daysToValentine === 0) {
      return `Valentine's Day is tomorrow! Get ready! 💕`;
    } else if (this.daysToValentine === 1) {
      return `Valentine's Day is in 1 day! Prepare your surprises! 💘`;
    } else if (this.daysToValentine <= 7) {
      return `Only ${this.daysToValentine} days until Valentine's! 🎯`;
    } else if (this.daysToValentine <= 14) {
      return `${this.daysToValentine} days until Valentine's Day 📅`;
    } else if (this.daysToValentine <= 30) {
      return `${this.daysToValentine} days to go for Valentine's 💕`;
    } else if (this.daysToValentine < 0) {
      return `Valentine's Day was ${-this.daysToValentine} days ago 💝`;
    } else {
      return `Valentine's Day in ${this.daysToValentine} days 💕`;
    }
  }

  showNotificationPopup(): void {
    this.showNotificationPopupFlag = true;
  }

  closeNotificationPopup(): void {
    this.showNotificationPopupFlag = false;
  }

  createValentineCard(): void {
    // Navigate to create card page
    this.closeNotificationPopup();
    this.router.navigate(['/valentine']);
  }

  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobileView = window.innerWidth < 768;
  }

  private formatTime(time: number): string {
    return time < 10 ? `0${time}` : `${time}`;
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.notificationCheckInterval) {
      clearInterval(this.notificationCheckInterval);
    }
  }
}
