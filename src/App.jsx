/* eslint-disable react/prop-types */
import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: `https://i.pravatar.cc/48?u=118836`,
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriendForm, setShowAddFriendForm] = useState(false);
  const [friendsList, setFriendsList] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const openAddFriendFormHandler = () => {
    setShowAddFriendForm((pravValue) => !pravValue);
    setSelectedFriend(null);
  };

  const addFriendHandler = (friend) => {
    setFriendsList((praveVal) => [...praveVal, friend]);
    setShowAddFriendForm(false);
  };

  const selectFriendHandler = (friend) => {
    setSelectedFriend(friend);
    setShowAddFriendForm(false);
  };

  const splitBillHandler = (value) => {
    setFriendsList((friends) => {
      return friends.map((friend) => {
        return friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend;
      });
    });
    setSelectedFriend(null);
  };

  return (
    <main className="app">
      <div className="sidebar">
        <FriendsList
          list={friendsList}
          onSelectFriend={selectFriendHandler}
          selectedFriend={selectedFriend}
        />

        {showAddFriendForm && <AddFriendForm onAddFriend={addFriendHandler} />}
        <Button onClick={openAddFriendFormHandler}>
          {showAddFriendForm ? "Close" : "Add Friend"}
        </Button>
      </div>

      {selectedFriend && (
        <SplitBillForm
          key={selectedFriend.id}
          selectedFriend={selectedFriend}
          onSplitBill={splitBillHandler}
        />
      )}
    </main>
  );
}

////////////////////////////
// REUSABLE UI COMPONENTS
function Button({ children, ...rest }) {
  return (
    <button className="button" {...rest}>
      {children}
    </button>
  );
}

////////////////////////////
// COMPONENTS

function FriendsList({ list, onSelectFriend, selectedFriend }) {
  const content = list.map((friend) => {
    return (
      <FriendListItem
        key={friend.id}
        friend={friend}
        selectFriendHandler={onSelectFriend}
        selectedFriend={selectedFriend}
      />
    );
  });

  return (
    <>
      <ul>{content}</ul>
    </>
  );
}

function FriendListItem({ friend, selectFriendHandler, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  let friendOweStatu = {
    text: `You and ${friend.name} are even`,
    class: "",
  };

  if (friend.balance > 0)
    friendOweStatu = {
      class: "green",
      text: `${friend.name} owes you ${friend.balance}$`,
    };

  if (friend.balance < 0)
    friendOweStatu = {
      text: `You owe ${friend.name} ${Math.abs(friend.balance)}$`,
      class: "red",
    };

  const selectHandler = () => {
    if (isSelected) {
      selectFriendHandler(null);
    } else {
      selectFriendHandler(friend);
    }
  };

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt="Friend Photo" />
      <h3>{friend.name}</h3>
      <p className={friendOweStatu.class}>{friendOweStatu.text}</p>
      <Button onClick={selectHandler}>{isSelected ? "Close" : "Select"}</Button>
    </li>
  );
}

function AddFriendForm({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  const submitHandler = (e) => {
    e.preventDefault();

    if (!name || !image)
      return alert(
        "📛 Oops! It seems you forgot to fill in the required fields. 📛"
      );

    const id = Math.random().toString();
    const newFriend = {
      id,
      name,
      image: `${image}?u=${id}`,
      balance: 0,
    };

    setName("");
    setImage("https://i.pravatar.cc/48");
    onAddFriend(newFriend);
  };

  return (
    <form className="form-add-friend" onSubmit={submitHandler}>
      <label htmlFor="name">👬 Name</label>
      <input
        type="text"
        id="name"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />

      <label htmlFor="name">📷 Image</label>
      <input
        type="text"
        id="name"
        onChange={(e) => setImage(e.target.value)}
        value={image}
      />

      <Button type="submit">Add</Button>
    </form>
  );
}

function SplitBillForm({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaing, setWhoIsPaing] = useState("user");

  const submitHandler = (e) => {
    e.preventDefault();

    if (!bill || !paidByUser)
      return alert(
        "📛 Oops! It seems you forgot to fill in the required fields. 📛"
      );

    onSplitBill(whoIsPaing === "user" ? paidByFriend : -paidByUser);
  };

  return (
    <form className="form-split-bill" onSubmit={submitHandler}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label htmlFor="bill-value">💰 Bill value</label>
      <input
        type="number"
        id="bill-value"
        value={bill}
        onChange={(e) => setBill(+e.target.value)}
      />

      <label htmlFor="your-expense">🙎‍♂️ Your expense:</label>
      <input
        type="number"
        id="your-expense"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(+e.target.value > bill ? paidByUser : +e.target.value)
        }
      />

      <label htmlFor="friend-expense">
        {`👬 ${selectedFriend.name}'s expense:`}
      </label>
      <input type="number" value={paidByFriend} id="friend-expense" disabled />

      <label htmlFor="friend-expense">🤑 Who is paying the bill?</label>
      <select
        id="friend-expense"
        value={whoIsPaing}
        onChange={(e) => setWhoIsPaing(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button type="submit">Split bill</Button>
    </form>
  );
}
