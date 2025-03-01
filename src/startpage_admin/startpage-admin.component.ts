import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../app/services/user.service';

@Component({
  selector: 'app-startpage-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './startpage-admin.component.html',
  styleUrls: ['../styles.css']
})
export class StartpageAdminComponent {
  users: { name: string; roles: string[] }[] = [];
  events: { name: string; payer: string; amount: number; beneficiaries: string[] }[] = [];

  eventFormVisible = false;
  newEvent = { name: '', payer: '', amount: 0, beneficiaries: [] as string[] };

  // Für die Autovervollständigung
  payer = '';
  beneficiaryInput = '';
  filteredUsers: { name: string; roles: string[] }[] = [];
  filteredBeneficiaries: { name: string; roles: string[] }[] = [];

  selectedPayer: { name: string; roles: string[] } | null = null;
  showPayerSuggestions = false;
  showBeneficiarySuggestions = false;

  constructor(private userService: UserService) {
    this.loadUsersAndEvents();
  }

  // 🔄 Lädt Nutzer und Ereignisse aus dem UserService
  loadUsersAndEvents() {
    this.users = this.userService.getUsers();
    this.events = this.userService.getEvents();
  }

  // 🟢 Zeigt oder versteckt das Formular
  toggleEventForm() {
    this.eventFormVisible = !this.eventFormVisible;
  }

  // ❌ Setzt das Formular zurück
  cancelEventCreation() {
    this.newEvent = { name: '', payer: '', amount: 0, beneficiaries: [] };
    this.payer = '';
    this.beneficiaryInput = '';
    this.selectedPayer = null;
    this.eventFormVisible = false;
  }

  // 🔍 Filtert Nutzer für die Zahlerauswahl
  filterUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(this.payer.toLowerCase())
    );
  }

  // ✅ Setzt den Zahler, wenn ein Name ausgewählt wurde
  selectPayer(user: { name: string; roles: string[] }) {
    this.selectedPayer = user;
    this.newEvent.payer = user.name;
    this.payer = user.name;
    this.showPayerSuggestions = false;
  }

  // 🔍 Filtert Nutzer für die Empfängerauswahl
  filterBeneficiaries() {
    this.filteredBeneficiaries = this.users.filter(user =>
      user.name.toLowerCase().includes(this.beneficiaryInput.toLowerCase()) &&
      !this.newEvent.beneficiaries.includes(user.name)
    );
  }

  // ➕ Fügt einen Empfänger hinzu
  addBeneficiary(user: { name: string; roles: string[] }) {
    if (!this.newEvent.beneficiaries.includes(user.name)) {
      this.newEvent.beneficiaries.push(user.name);
    }
    this.beneficiaryInput = '';
    this.showBeneficiarySuggestions = false;
  }

  // ❌ Entfernt einen Empfänger
  removeBeneficiary(name: string) {
    this.newEvent.beneficiaries = this.newEvent.beneficiaries.filter(b => b !== name);
  }

  // 💾 Speichert das Ereignis
  saveEvent() {
    if (this.newEvent.name && this.newEvent.payer && this.newEvent.amount > 0 && this.newEvent.beneficiaries.length > 0) {
      this.userService.addEvent(this.newEvent);
      this.events = this.userService.getEvents();
      this.cancelEventCreation();
    }
  }

  // ❌ Löscht ein Ereignis
  deleteEvent(index: number) {
    this.events.splice(index, 1);
    this.userService.setEvents(this.events);
  }

  // ❌ Löscht einen Benutzer und aktualisiert alle Ereignisse
  deleteUser(index: number) {
    const userToDelete = this.users[index].name;

    // Entferne den Benutzer aus der Liste
    this.users.splice(index, 1);
    this.userService.setUsers(this.users);

    // Entferne den Benutzer aus allen Ereignissen
    this.events.forEach(event => {
      if (event.payer === userToDelete) {
        event.payer = ''; // Markiert als gelöscht
      }
      event.beneficiaries = event.beneficiaries.filter(b => b !== userToDelete);
    });

    // Ereignisse aktualisieren
    this.userService.setEvents(this.events);
  }

  // 💰 Berechnet Schuldenübersicht
  calculateDebts(): { [key: string]: number } {
    let debts: { [key: string]: number } = {};
    this.users.forEach(user => (debts[user.name] = 0));

    this.events.forEach(event => {
      const splitAmount = event.amount / event.beneficiaries.length;
      event.beneficiaries.forEach(beneficiary => {
        debts[beneficiary] -= splitAmount;
        debts[event.payer] += splitAmount;
      });
    });

    return debts;
  }

  // 🟢 Holt die Farbe einer Rolle
  getRoleColor(role: string): string {
    return this.userService.getRoleColor(role);
  }
}











