import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHeart,
  faSkull,
  faLock,
  faEye,
  faGear,
  faQuestionCircle,
  faExternalLinkAlt,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  // Icons
  faHeart = faHeart;
  faSkull = faSkull;
  faLock = faLock;
  faEye = faEye;
  faGear = faGear;
  faQuestionCircle = faQuestionCircle;
  faExternalLinkAlt = faExternalLinkAlt;
  faEnvelope = faEnvelope;

  // Current year for copyright
  currentYear = new Date().getFullYear();

  // Company information
  companyInfo = {
    name: '4Shards Ltd.',
    address: '5 South Charlotte Street, Edinburgh, EH2 4AN, UK',
    email: 'contact@cryptmind.com',
    phone: '+44 20 1234 5678',
    registration: 'Company No: 12345678'
  };

  // Privacy and legal links
  legalLinks = [
    { name: 'Privacy Policy', route: '/privacy' },
    { name: 'Terms of Service', route: '/terms' },
    { name: 'Cookie Policy', route: '/cookies' },
    { name: 'Data Protection', route: '/data-protection' },
    { name: 'Accessibility', route: '/accessibility' }
  ];

  // Social media links
  socialLinks = [
  ];


}
