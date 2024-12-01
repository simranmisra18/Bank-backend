"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AddCustomerForm } from "./components/AddCustomerForm";

const USER_KEYS = [
  "Customer ID",
  "First Name",
  "Middle Name",
  "Last Name",
  "Pincode",
  "Credit Limit",
  "Credit Usage",
  "Credit Score",
  "Balance",
  "Registration Time",
];

const USER_DB_KEYS = [
  "customer_id",
  "first_name",
  "middle_name",
  "last_name",
  "pincode",
  "credit_limit",
  "credit_usage",
  "credit_score",
  "balance",
  "registration_time",
];

const itemRenderer = (item: string, key: string): string => {
  if (key === "Registration Time") {
    const date = new Date(item);
    return `${date.getMonth() < 9 ? 0 : ""}${date.getMonth() + 1}/${
      date.getFullYear() % 100
    }`;
  }
  return item;
};

export default function Page() {
  const { branchid, branch_name: branchName } = useParams<{
    branchid: string;
    branch_name: string;
  }>();
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<object[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [activeKeys, setActiveKeys] = useState(() => {
    const keyobj = Object.fromEntries(USER_KEYS.map((key) => [key, false]));
    keyobj[USER_KEYS[0]] = true;
    keyobj[USER_KEYS[1]] = true;
    keyobj[USER_KEYS[8]] = true;
    keyobj[USER_KEYS[9]] = true;
    return keyobj;
  });

  useEffect(() => {
    setLoading(true);
    // fetch(`/api/users?branchid=${branchid}&offset=${offset}`)
    fetch(`http://localhost:8000/api/users?branchid=${branchid}&offset=${offset}`, {
      headers: {
        'Authorization': 'Bearer ' +String(localStorage.getItem('token'))
      }
    })
      .then((res) => res.json())
      .then((res) => {
        setUsers(
          res.data.map((di: { [key: string]: string }) => ({
            [USER_KEYS[0]]: di[USER_DB_KEYS[0]],
            [USER_KEYS[1]]: di[USER_DB_KEYS[1]],
            [USER_KEYS[2]]: di[USER_DB_KEYS[2]],
            [USER_KEYS[3]]: di[USER_DB_KEYS[3]],
            [USER_KEYS[4]]: di[USER_DB_KEYS[4]],
            [USER_KEYS[5]]: di[USER_DB_KEYS[5]],
            [USER_KEYS[6]]: di[USER_DB_KEYS[6]],
            [USER_KEYS[7]]: di[USER_DB_KEYS[7]],
            [USER_KEYS[8]]: di[USER_DB_KEYS[8]],
            [USER_KEYS[9]]: di[USER_DB_KEYS[9]],
          }))
        );
        setCount(res.count);
        setOffset(res.offset);
      })
      .catch((err) => {
        alert(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
    setLoading(false);
  }, [offset, branchid]);

  return (
    <div className="flex flex-col min-h-[100vh] bg-slate-100 justify-center items-center py-10">
      <h1 className="text-4xl font-light">
        You are logged into{" "}
        <strong className="font-normal">
          {branchName.replaceAll("%20", " ")}
        </strong>
      </h1>
      <div className="p-8 m-4 bg-white flex flex-col w-4/5 sm:w-1/2 justify-center items-center rounded-lg">
        <h3 className="text-xl">Registered customers</h3>
        <div className="text-right w-full">
          <button onClick={() => setShowFilter((a) => !a)}>Filter</button>
          <ul
            className={`transition-all duration-200 overflow-hidden ${
              showFilter ? "bg-slate-200 p-2 h-64" : "h-0"
            }`}
          >
            {USER_KEYS.map((key) => (
              <li key={key}>
                <label htmlFor={`filter:${key}`}>{key}</label>{" "}
                <input
                  type="checkbox"
                  checked={activeKeys[key]}
                  id={`filter:${key}`}
                  onChange={() => {
                    setActiveKeys((prev) => ({ ...prev, [key]: !prev[key] }));
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="overflow-x-auto w-full mt-2">
          <table className="table-layout: auto; table-fixed min-w-full text-center border">
            <thead>
              <tr className="border">
                {Object.entries(activeKeys).map(([key, show]) =>
                  show ? (
                    <th key={key} className="min-w-12 border px-2 py-1">
                      {key}
                    </th>
                  ) : null
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <tr className="border">
                    <td className="border" colSpan={10}>Loading...</td>
                  </tr>
                </>
              ) : (
                <>
                  {users.map((user, i) => (
                    <tr key={i + offset}>
                      {USER_KEYS.map((key) =>
                        activeKeys[key] ? (
                          <td key={key} className="border px-2 py-1">
                            {itemRenderer(
                              (user as unknown as { [a: string]: string })[
                                key
                              ] ?? "",
                              key
                            )}
                          </td>
                        ) : null
                      )}
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end w-full gap-2 items-center mt-2">
          <button
            className="px-2 py-1 border border-slate-200 hover:bg-slate-100"
            onClick={() => setOffset(offset - 5)}
            disabled={offset === 0}
          >
            Previous
          </button>
          <span>
            {offset + 1} - {offset + 5} of {count}
          </span>
          <button
            className="px-2 py-1 border border-slate-200 hover:bg-slate-100"
            onClick={() => setOffset(offset + 5)}
            disabled={offset + 5 >= count}
          >
            Next
          </button>
        </div>
      </div>
      <div className="p-8 m-4 bg-white flex flex-col w-4/5 sm:w-1/2 justify-center items-center rounded-lg">
        <AddCustomerForm branch_id={branchid}/>
      </div>

    </div>
  );
}
