import React, { useState, useEffect } from 'react';
import Ticket from './Ticket';
import Filter from './Filter';
import Sort from './Sort';
import './KanbanBoard.css';

function KanbanBoard() {
  const [tickets, setTickets] = useState([]);
  const [grouping, setGrouping] = useState('status');
  const [sorting, setSorting] = useState('title');
  const [newTicket, setNewTicket] = useState({ title: '', status: 'Backlog', userId: '', priority: 0 });
  const [userMapping, setUserMapping] = useState({}); 

  useEffect(() => {
    const storedGrouping = localStorage.getItem('grouping') || 'status';
    const storedSorting = localStorage.getItem('sorting') || 'title';
    setGrouping(storedGrouping);
    setSorting(storedSorting);

    fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then((response) => response.json())
      .then((data) => {
        setTickets(data.tickets);

        const mapping = {};
        data.users.forEach((user) => {
          mapping[user.id] = user.name;
        });
        setUserMapping(mapping);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  const groupTickets = (tickets, grouping) => {
    if (grouping === 'status') {
      // Group by status
      const groupedTickets = {};
      tickets.forEach((ticket) => {
        if (!groupedTickets[ticket.status]) {
          groupedTickets[ticket.status] = [ticket];
        } else {
          groupedTickets[ticket.status].push(ticket);
        }
      });
      return groupedTickets;
    } else if (grouping === 'user') {
      // Group by user
      const groupedTickets = {};
      tickets.forEach((ticket) => {
        const user = userMapping[ticket.userId] || 'Unknown User';
        if (!groupedTickets[user]) {
          groupedTickets[user] = [ticket];
        } else {
          groupedTickets[user].push(ticket);
        }
      });
      return groupedTickets;
    } else if (grouping === 'priority') {
      // Group by priority
      const groupedTickets = {};
      tickets.forEach((ticket) => {
        if (!groupedTickets[ticket.priority]) {
          groupedTickets[ticket.priority] = [ticket];
        } else {
          groupedTickets[ticket.priority].push(ticket);
        }
      });
      return groupedTickets;
    }
    return [tickets];
  };
  

  const sortTickets = () => {
    const sortedTickets = [...tickets];
    if (sorting === 'title') {
      sortedTickets.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sorting === 'priority') {
      sortedTickets.sort((a, b) => b.priority - a.priority);
    }
    setTickets(sortedTickets);
  };

  const deleteTicket = (ticketId) => {
    const updatedTickets = tickets.filter((ticket) => ticket.id !== ticketId);
    setTickets(updatedTickets);
  };

  const handleGroupingChange = (newGrouping) => {
    setGrouping(newGrouping);
    localStorage.setItem('grouping', newGrouping);
  };

  const handleSortingChange = (newSorting) => {
    setSorting(newSorting);
    localStorage.setItem('sorting', newSorting);
    sortTickets();
  };

  const handleCreateTicket = () => {
    setTickets([...tickets, newTicket]);
    setNewTicket({ title: '', status: 'Backlog', userId: '', priority: 0 });
  };

  return (
    <div className="kanban-board">
      <h1 className="kanban-heading">KANBAN BOARD</h1>
      <Filter handleGroupingChange={handleGroupingChange} />
      <Sort handleSortingChange={handleSortingChange} />
      <div className="ticket-container">
        {Object.entries(groupTickets(tickets, grouping)).map(([group, groupTickets]) => (
          <div key={group}>
            <h2>{group}</h2>
            {groupTickets.map((ticket) => (
              <Ticket key={ticket.id} ticket={ticket} deleteTicket={deleteTicket} />
            ))}
          </div>
        ))}
      </div>
      <div className="create-ticket-form">
        <input
          type="text"
          placeholder="Title"
          value={newTicket.title}
          onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Status"
          value={newTicket.status}
          onChange={(e) => setNewTicket({ ...newTicket, status: e.target.value })}
        />
        <input
          type="text"
          placeholder="User"
          value={newTicket.userId}
          onChange={(e) => setNewTicket({ ...newTicket, userId: e.target.value })}
        />
        <input
          type="number"
          placeholder="Priority"
          value={newTicket.priority}
          onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
        />
        <button onClick={handleCreateTicket}>Create Ticket</button>
      </div>
    </div>
  );
}

export default KanbanBoard;
