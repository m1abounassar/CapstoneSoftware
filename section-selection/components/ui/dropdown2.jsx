import * as React from "react";

const DropdownTwo = () => {
  const [open, setOpen] = React.useState(false);
  const [showPopup, setShowPopup] = React.useState(false);

  const handleSelect = (option) => {
    if (option === "profile") {
      setShowPopup(true);
    } else if (option === "logout") {
      window.location.href = "/logout.php";
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center text-2xl font-bold px-3 py-1 transition-all focus:outline-none"
      >
        ☰
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          <div
            onClick={() => handleSelect("profile")}
            className="p-2 cursor-pointer hover:bg-gray-100 text-center"
          >
            Profile
          </div>
          <div
            onClick={() => handleSelect("logout")}
            className="p-2 cursor-pointer hover:bg-gray-100 text-center text-red-500"
          >
            Logout
          </div>
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96 text-center">
            <h2 className="text-xl font-bold mb-4 text-[#003056]">Profile</h2>
            <p className="text-[#003056]">Your profile details go here.</p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 px-4 py-2 bg-[#003056] text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { DropdownTwo };
