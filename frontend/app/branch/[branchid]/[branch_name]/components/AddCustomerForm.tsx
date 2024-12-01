"use client";

import { FormEvent, useState } from "react";

type User = {
  first_name: string;
  middle_name: string;
  last_name: string;
  loc: string;
  pinCode: string;
  st: string;
  password: string;
  branch_id: string;
};

export const AddCustomerForm = ({branch_id} : { branch_id : string}) => {
  const [user, setUser] = useState<User>({
    first_name: "",
    middle_name: "",
    last_name: "",
    loc: "",
    pinCode: "",
    st: "",
    password: "",
    branch_id,
  });

  const onAddCustomer = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // fetch('/api/adduser', { method: 'POST', body: JSON.stringify(user) }).then(res => res.json()).then((res : {id : string}) => {
      fetch('http://localhost:8000/api/adduser', 
        { method: 'POST',
          headers: {
            'Authorization': 'Bearer ' +String(localStorage.getItem('token'))
          },
           body: JSON.stringify(user) 
          }).then(res => res.json()).then((res : {id : string}) => {
      alert("User Created Successfully, user_id : " + res.id);
      setUser({
        first_name: "",
        middle_name: "",
        last_name: "",
        loc: "",
        pinCode: "",
        st: "",
        password: "",
        branch_id,
      });
    }).catch(err => {
      alert('Error adding user, ' + err.message);
    })
  };

  return (
    <form onSubmit={onAddCustomer} className="flex flex-col items-center">
      <h3 className="text-xl mb-4">Add a customer</h3>
      <div className="grid grid-cols-2 gap-2">
        <label htmlFor="add:name">First Name*</label>
        <input
          value={user.first_name}
          onChange={(e) =>
            setUser((prev) => ({ ...prev, first_name: e.target.value }))
          }
          id="add:name"
          className="px-2 py-1 border border-slate-200"
          placeholder="Enter First Name"
          required
        />
        <label htmlFor="add:mname">Middle Name</label>
        <input
          value={user.middle_name}
          onChange={(e) =>
            setUser((prev) => ({ ...prev, middle_name: e.target.value }))
          }
          id="add:mname"
          className="px-2 py-1 border border-slate-200"
          placeholder="Enter Middle Name"
        />
        <label htmlFor="add:lname">Last Name*</label>
        <input
          value={user.last_name}
          onChange={(e) =>
            setUser((prev) => ({ ...prev, last_name: e.target.value }))
          }
          id="add:lname"
          className="px-2 py-1 border border-slate-200"
          placeholder="Enter Last Name"
        />
        <label htmlFor="add:name">Address</label>
        <input
          value={user.loc}
          onChange={(e) =>
            setUser((prev) => ({ ...prev, loc: e.target.value }))
          }
          id="add:name"
          className="px-2 py-1 border border-slate-200"
          placeholder="Enter Street Address"
        />
        <label htmlFor="add:name">Pin Code*</label>
        <input
          value={user.pinCode}
          onChange={(e) =>
            setUser((prev) => ({ ...prev, pinCode: e.target.value }))
          }
          id="add:name"
          type="number"
          className="px-2 py-1 border border-slate-200"
          placeholder="Enter Pin Code"
          required
        />
        <label htmlFor="add:name">State*</label>
        <input
          value={user.st}
          onChange={(e) => setUser((prev) => ({ ...prev, st: e.target.value }))}
          id="add:name"
          className="px-2 py-1 border border-slate-200"
          placeholder="Enter State"
          required
        />
        <label htmlFor="add:name">Password*</label>
        <input
          value={user.password}
          onChange={(e) =>
            setUser((prev) => ({ ...prev, password: e.target.value }))
          }
          id="add:name"
          className="px-2 py-1 border border-slate-200"
          placeholder="Enter Password"
          required
        />
      </div>
      <div className="flex justify-end mt-2 w-full">
        <button
          className="px-2 py-1 border border-slate-200 hover:bg-slate-100"
          type="submit"
        >
          Add Customer
        </button>
      </div>
    </form>
  );
};
