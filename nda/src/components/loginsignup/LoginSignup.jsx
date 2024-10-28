import React, { useState, useEffect } from 'react';
import './LoginSignup.css';

const LoginSignup = () => {
  const [action, setAction] = useState("Sign Up");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Customer data state
  const [customerData, setCustomerData] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [file, setFile] = useState(null); // Store the actual file
  const [validityDate, setValidityDate] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shortNote, setShortNote] = useState("");

  // NDA state
  const [ndaData, setNdaData] = useState([]);
  const [selectedNda, setSelectedNda] = useState(null);  // Holds the NDA to be modified

  const saveUser = (user) => {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  };

  const findUserByEmail = (email) => {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(user => user.email === email);
  };

  // Handle Sign Up and Login actions
  const handleSubmit = () => {
    if (action === "Sign Up") {
      if (name && email && password) {
        const existingUser = findUserByEmail(email);
        if (existingUser) {
          alert("User already exists. Please log in.");
        } else {
          saveUser({ name, email, password });
          alert("Signup successful! Please login.");
          setAction("Login");
        }
      } else {
        alert("Please fill in all fields for signup.");
      }
    } else if (action === "Login") {
      if (email && password) {
        const user = findUserByEmail(email);
        if (user) {
          if (user.password === password) {
            setIsLoggedIn(true);
            setName(user.name); // Set the name from the logged-in user
            alert("Login successful!");
          } else {
            alert("Incorrect password.");
          }
        } else {
          alert("User not found. Please sign up.");
        }
      } else {
        alert("Please fill in all fields for login.");
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    setName("");
  };

  // Handle the customer form submission
  const handleCustomerSubmit = () => {
    const newCustomer = {
      id: customerData.length + 1,
      customerName,
      file: file ? file.name : "",
      validityDate,
      contactPerson,
      customerEmail,
      shortNote
    };

    setCustomerData([...customerData, newCustomer]);
    resetFormFields();
  };

  // Register NDA
  const handleAddNDA = () => {
    const newNda = {
      id: ndaData.length + 1,
      customerName,
      file,
      validityDate,
      contactPerson,
      customerEmail,
      shortNote
    };

    setNdaData([...ndaData, newNda]);
    
    resetFormFields();
  };

  // Reset form fields
  const resetFormFields = () => {
    setCustomerName("");
    setFile(null);
    setValidityDate("");
    setContactPerson("");
    setCustomerEmail("");
    setShortNote("");
    setSelectedNda(null); // Reset selected NDA when the form is cleared
  };

  // Modify NDA
  const handleModifyNDA = (nda) => {
    setSelectedNda(nda);
    setCustomerName(nda.customerName);
    setFile(nda.file);
    setValidityDate(nda.validityDate);
    setContactPerson(nda.contactPerson);
    setCustomerEmail(nda.customerEmail);
    setShortNote(nda.shortNote);
  };

  // Save modified NDA
  const handleSaveModifiedNDA = () => {
    const updatedNda = {
      ...selectedNda,
      customerName,
      file,
      validityDate,
      contactPerson,
      customerEmail,
      shortNote
    };

    setNdaData(ndaData.map(nda => (nda.id === selectedNda.id ? updatedNda : nda)));
    
    resetFormFields();
  };

  // Delete NDA
  const handleDeleteNDA = (id) => {
    setNdaData(ndaData.filter(nda => nda.id !== id));
  };

  // Open file in a new tab
  const handleOpenFile = (file) => {
    if (file) {
      const fileUrl = URL.createObjectURL(file); // Create a Blob URL for the file
      window.open(fileUrl, '_blank'); // Open in new tab
    } else {
      alert("No file available to open.");
    }
  };

  return (
    <div className='container'>
      {isLoggedIn ? (
        <div className='logged-in'>
          <h2>Welcome, {name}!</h2>
          <button className='submit' onClick={handleLogout}>Logout</button>

          {/* Customer data form */}
          <div className='customer-form'>
            <h3>{selectedNda ? "Modify NDA" : "Enter NDA Details"}:</h3>
            <div className='customer-grid'>
              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <input
                type="file"
                placeholder="File"
                onChange={(e) => setFile(e.target.files[0])} // Store the actual file
              />
              <input
                type="date"
                placeholder="Validity Date"
                value={validityDate}
                onChange={(e) => setValidityDate(e.target.value)}
              />
              <input
                type="text"
                placeholder="Contact Person"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email ID"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
              <input
                type="text"
                placeholder="Short Note"
                value={shortNote}
                onChange={(e) => setShortNote(e.target.value)}
              />
            </div>
            <button
              className='submit'
              onClick={selectedNda ? handleSaveModifiedNDA : handleAddNDA}
            >
              {selectedNda ? "Save Changes" : "Add NDA"}
            </button>
          </div>

          {/* NDA options and table */}
          <div className='nda-options'>
            <h3>NDA Records:</h3>
            <table className="nda-table">
              <thead>
                <tr>
                  <th>Primary Key</th>
                  <th>Customer Name</th>
                  <th>File</th>
                  <th>Validity Date</th>
                  <th>Contact Person</th>
                  <th>Email ID</th>
                  <th>Short Note</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ndaData.map((nda) => (
                  <React.Fragment key={nda.id}>
                    {/* First row with the main details */}
                    <tr>
                      <td>{nda.id}</td>
                      <td>{nda.customerName}</td>
                      <td>
                        <button onClick={() => handleOpenFile(nda.file)}>Open File</button>
                      </td>
                      <td>{nda.validityDate}</td>
                      <td>{nda.contactPerson}</td>
                      <td>{nda.customerEmail}</td>
                      <td>{nda.shortNote}</td>
                      <td>
                        <button onClick={() => handleModifyNDA(nda)}>Modify NDA</button>
                        <button onClick={() => handleDeleteNDA(nda.id)}>Delete NDA</button>
                      </td>
                    </tr>

                    {/* Second row with additional details */}
                  
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          <div className='header'>
            <div className='text'>{action}</div>
            <div className='underLine'></div>
          </div>
          <div className='inputs'>
            {action === "Login" ? null : (
              <div className='input'>
                <input
                  type='text'
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div className='input'>
              <input
                type='email'
                placeholder="Email-Id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='input'>
              <input
                type='password'
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {action === "Sign Up" ? null : (
            <div className='forgot-password'>
              Forgot Password? <span>Click Here</span>
            </div>
          )}
          <div className='submit-container'>
            <button
              className={`submit ${action === "Sign Up" ? "" : "gray"}`}
              onClick={() => setAction("Sign Up")}
            >
              Sign Up
            </button>
            <button
              className={`submit ${action === "Login" ? "" : "gray"}`}
              onClick={() => setAction("Login")}
            >
              Login
            </button>
          </div>
          <button className='submit main-action' onClick={handleSubmit}>
            {action === "Login" ? "Login" : "Sign Up"}
          </button>
        </>
      )}
    </div>
  );
};

export default LoginSignup;
