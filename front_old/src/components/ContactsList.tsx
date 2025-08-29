import React from 'react';
import { Contact } from '../types';
import ContactItem from './ContactItem';

interface ContactsListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onContactSelect: (contact: Contact) => void;
}

const ContactsList: React.FC<ContactsListProps> = ({ 
  contacts, 
  selectedContact, 
  onContactSelect 
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {contacts.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-gray-500">
          No contacts found
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {contacts.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              isSelected={selectedContact?.id === contact.id}
              onClick={() => onContactSelect(contact)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactsList;