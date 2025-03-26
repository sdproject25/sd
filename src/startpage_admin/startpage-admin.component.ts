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
  payer = '';
  selectedPayer: { name: string; roles: string[] } | null = null;
  filteredUsers: { name: string; roles: string[] }[] = [];
  filteredBeneficiaries: { name: string; roles: string[] }[] = [];
  selectedBeneficiaries: { name: string; roles: string[] }[] = [];

  constructor(private userService: UserService) {
    this.loadUsersAndEvents();
  }

  // 🔄 Daten aus dem Service laden
  loadUsersAndEvents() {
    this.users = this.userService.getUsers();
    this.events = this.userService.getEvents();
  }

  // 🔘 Formular ein-/ausblenden
  toggleEventForm() {
    this.eventFormVisible = !this.eventFormVisible;
  }

  // 🔄 Ereignis abbrechen (Formular leeren)
  cancelEventCreation() {
    this.newEvent = { name: '', payer: '', amount: 0, beneficiaries: [] };
    this.payer = '';
    this.selectedPayer = null;
    this.selectedBeneficiaries = [];
    this.eventFormVisible = false;
  }

  // 🔍 Nutzerfilter für Payer (Autovervollständigung)
  filterUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(this.payer.toLowerCase())
    );
  }

  // ✅ Payer auswählen
  selectPayer(user: { name: string; roles: string[] }) {
    this.newEvent.payer = user.name;
    this.selectedPayer = user;
    this.payer = user.name;
    this.filteredUsers = [];
  }

  // 🔍 Nutzerfilter für Empfänger (Autovervollständigung)
  filterBeneficiaries(event: any) {
    const inputValue = event.target.value.toLowerCase();
    this.filteredBeneficiaries = this.users.filter(user =>
      user.name.toLowerCase().includes(inputValue) &&
      !this.selectedBeneficiaries.some(b => b.name === user.name)
    );
  }

  // ✅ Nutzer als Empfänger hinzufügen
  addBeneficiary(user: { name: string; roles: string[] }) {
    this.selectedBeneficiaries.push(user);
    this.newEvent.beneficiaries.push(user.name);
    this.filteredBeneficiaries = [];
  }

  // ❌ Empfänger entfernen
  removeBeneficiary(user: { name: string; roles: string[] }) {
    this.selectedBeneficiaries = this.selectedBeneficiaries.filter(b => b.name !== user.name);
    this.newEvent.beneficiaries = this.newEvent.beneficiaries.filter(name => name !== user.name);
  }

  // 💾 Ereignis speichern
  saveEvent() {
    if (this.newEvent.name && this.newEvent.payer && this.newEvent.amount > 0 && this.newEvent.beneficiaries.length > 0) {
      this.userService.addEvent(this.newEvent);
      this.events = this.userService.getEvents();
      this.cancelEventCreation();
    }
  }

  // ❌ Ereignis löschen
  deleteEvent(index: number) {
    this.events.splice(index, 1);
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

  // 🟢 Rollenfarbe abrufen
  getRoleColor(role: string): string {
    return this.userService.getRoleColor(role);
  }

  // 🟢 Payer-Farbe abrufen
  getPayerColor(): string {
    if (this.selectedPayer) {
      const roleColor = this.selectedPayer.roles.map(role => this.getRoleColor(role));
      return roleColor.length > 0 ? roleColor[0] : '#000000';
    }
    return '#000000';
  }

  // 🔴 Benutzer löschen
  deleteUser(index: number) {
    const userToDelete = this.users[index].name;
    this.users.splice(index, 1);
    this.userService.setUsers(this.users);

    this.events.forEach(event => {
      if (event.payer === userToDelete) {
        event.payer = '';
      }
      event.beneficiaries = event.beneficiaries.filter(b => b !== userToDelete);
    });

    this.userService.setEvents(this.events);
  }
}













