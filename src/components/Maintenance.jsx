import React from "react";

const Maintenance = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-red-600">Maintenance</h1>
        <p className="mt-4 text-lg text-gray-700">
          We’re currently performing maintenance. We apologize for any inconvenience this may cause.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Please check back later or contact support if you need immediate assistance.
        </p>
      </div>
    </div>
  );
};

export default Maintenance;
