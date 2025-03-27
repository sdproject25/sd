import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../app/services/user.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-startpage-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './startpage-admin.component.html',
  styleUrls: ['../styles.css']
})
export class StartpageAdminComponent implements OnInit {
  // Benutzerliste
  users: { name: string; roles: string[] }[] = [];

  // Ereignisliste
  events: { name: string; payer: string; amount: number; beneficiaries: string[] }[] = [];

  // Sichtbarkeit des Ereignisformulars
  eventFormVisible = false;

  // Neues Ereignis (temporär zum Bearbeiten/Speichern)
  newEvent = { name: '', payer: '', amount: 0, beneficiaries: [] as string[] };

  // Hilfsvariablen für Benutzerfilterung und Auswahl
  payer = '';
  selectedPayer: { name: string; roles: string[] } | null = null;
  filteredUsers: { name: string; roles: string[] }[] = [];
  filteredBeneficiaries: { name: string; roles: string[] }[] = [];
  selectedBeneficiaries: { name: string; roles: string[] }[] = [];
  editingIndex: number | null = null;

  // Detaillierte Schuldenaufstellung pro Benutzerpaar
  detailedDebts: { [debtor: string]: { [creditor: string]: number } } = {};

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsersAndEvents();
  }

  // Lädt Benutzer und Events aus dem Service
  loadUsersAndEvents() {
    this.users = this.userService.getUsers();
    this.events = this.userService.getEvents();
    this.detailedDebts = this.calculateDetailedDebts();
  }

  // Öffnet/schließt das Formular zum Erstellen/Bearbeiten von Events
  toggleEventForm() {
    this.eventFormVisible = !this.eventFormVisible;
    if (!this.eventFormVisible) {
      this.resetEventForm();
    }
  }

  // Setzt das Eventformular zurück
  resetEventForm() {
    this.newEvent = { name: '', payer: '', amount: 0, beneficiaries: [] };
    this.payer = '';
    this.selectedPayer = null;
    this.selectedBeneficiaries = [];
    this.editingIndex = null;
  }

  // Filtert Benutzerliste nach Eingabe für Zahler
  filterUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(this.payer.toLowerCase())
    );
  }

  // Wählt einen Benutzer als Zahler aus
  selectPayer(user: { name: string; roles: string[] }) {
    this.newEvent.payer = user.name;
    this.selectedPayer = user;
    this.payer = user.name;
    this.filteredUsers = [];
  }

  // Filtert mögliche Empfänger basierend auf Eingabe
  filterBeneficiaries(event: any) {
    const inputValue = event.target.value.toLowerCase();
    this.filteredBeneficiaries = this.users.filter(user =>
      user.name.toLowerCase().includes(inputValue) &&
      !this.selectedBeneficiaries.some(b => b.name === user.name)
    );
  }

  // Fügt einen Benutzer zur Empfängerliste hinzu
  addBeneficiary(user: { name: string; roles: string[] }) {
    this.selectedBeneficiaries.push(user);
    this.newEvent.beneficiaries.push(user.name);
    this.filteredBeneficiaries = [];
  }

  // Entfernt einen Benutzer aus der Empfängerliste
  removeBeneficiary(user: { name: string; roles: string[] }) {
    this.selectedBeneficiaries = this.selectedBeneficiaries.filter(b => b.name !== user.name);
    this.newEvent.beneficiaries = this.newEvent.beneficiaries.filter(name => name !== user.name);
  }

  // Lädt ein bestehendes Event in das Formular
  editEvent(index: number) {
    this.editingIndex = index;
    const eventToEdit = this.events[index];
    this.newEvent = { ...eventToEdit };
    this.payer = eventToEdit.payer;
    this.selectedPayer = this.users.find(user => user.name === eventToEdit.payer) || null;
    this.selectedBeneficiaries = this.users.filter(user => eventToEdit.beneficiaries.includes(user.name));
    this.eventFormVisible = true;
  }

  // Speichert ein neues oder bearbeitetes Event
  saveEvent() {
    if (this.newEvent.name && this.newEvent.payer && this.newEvent.amount > 0 && this.newEvent.beneficiaries.length > 0) {
      if (this.editingIndex !== null) {
        this.events[this.editingIndex] = { ...this.newEvent };
        this.userService.setEvents(this.events);
      } else {
        this.userService.addEvent(this.newEvent);
        this.events = this.userService.getEvents();
      }
      this.detailedDebts = this.calculateDetailedDebts();
      this.resetEventForm();
      this.eventFormVisible = false;
    }
  }

  // Löscht ein Event anhand des Index
  deleteEvent(index: number) {
    this.events.splice(index, 1);
    this.userService.setEvents(this.events);
    this.detailedDebts = this.calculateDetailedDebts();
  }

  // Berechnet die Bilanz jeder Person (vereinfachte Schulden)
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

  // Berechnet detaillierte Schuldenbeziehungen zwischen Nutzern
  calculateDetailedDebts(): { [debtor: string]: { [creditor: string]: number } } {
    const detailedDebts: { [debtor: string]: { [creditor: string]: number } } = {};

    this.users.forEach(user => {
      detailedDebts[user.name] = {};
      this.users.forEach(other => {
        if (user.name !== other.name) {
          detailedDebts[user.name][other.name] = 0;
        }
      });
    });

    this.events.forEach(event => {
      const splitAmount = event.amount / event.beneficiaries.length;
      event.beneficiaries.forEach(beneficiary => {
        if (beneficiary !== event.payer) {
          detailedDebts[beneficiary][event.payer] += splitAmount;
        }
      });
    });

    return detailedDebts;
  }

  // Exportiert die Schuldenübersicht als PDF
  downloadDebtPdf() {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('💸 Schuldenübersicht', 10, 10);

    let y = 20;
    this.users.forEach(debtor => {
      this.users.forEach(creditor => {
        if (debtor.name !== creditor.name) {
          const amount = this.detailedDebts[debtor.name][creditor.name];
          if (amount > 0) {
            doc.text(`${debtor.name} schuldet ${creditor.name}: ${amount.toFixed(2)} €`, 10, y);
            y += 8;
          }
        }
      });
    });

    doc.save('schuldenuebersicht.pdf');
  }

  // Gibt Farbe zu einer Rolle zurück (z. B. für Badge)
  getRoleColor(role: string): string {
    return this.userService.getRoleColor(role);
  }

  // Gibt Farbe basierend auf dem Zahler zurück
  getPayerColor(payer: string): string {
    return this.getRoleColor(payer);
  }

  // Entfernt Benutzer, aktualisiert Events und Schulden
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
    this.detailedDebts = this.calculateDetailedDebts();
  }
}














