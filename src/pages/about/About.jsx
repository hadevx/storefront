import React from "react";
import Layout from "../../Layout";

export default function About() {
  return (
    <Layout>
      <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-rose-600 mb-6">About Us</h1>
        <p className="text-gray-700 mb-4">
          Welcome to IPSUM Store! We are dedicated to providing the best products and services to
          our customers. Our mission is to make your shopping experience smooth, enjoyable, and
          reliable.
        </p>
        <p className="text-gray-700 mb-4">
          We carefully select our products to ensure quality and value. Our team is committed to
          customer satisfaction and is always here to help.
        </p>
        <p className="text-gray-700">
          Thank you for choosing IPSUM Store. We hope you enjoy your shopping experience with us!
        </p>
      </div>
    </Layout>
  );
}
