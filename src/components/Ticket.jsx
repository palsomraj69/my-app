import React, { useState } from 'react';
import './Ticket.css';

function Ticket({ ticket, deleteTicket }) {
  const [isEditing, setEditing] = useState(false);
  const [editedTicket, setEditedTicket] = useState(ticket);

  const handleSave = () => {
    setEditing(false);
  };

  const handleDelete = () => {
    deleteTicket(ticket.id);
  };

  return (
    <div className="ticket">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedTicket.title}
            onChange={(e) => setEditedTicket({ ...editedTicket, title: e.target.value })}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      ) : (
        <div>
          <h3>{ticket.title}</h3>
          <p>Priority: {ticket.priority}</p>
          <p>Tags: {ticket.tag.join(', ')}</p>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default Ticket;
