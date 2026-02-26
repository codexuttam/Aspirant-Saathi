import React from "react";
import Navbar from "../components/Navbar";
import "../styles/Home.css";

export default function Privacy() {
    return (
        <div className="page-wrapper">
            <Navbar />
            <div className="content-container" style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", fontFamily: "Inter, sans-serif", color: "#334155" }}>
                <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "20px", color: "#1e293b" }}>Privacy Policy</h1>
                <p style={{ marginBottom: "10px", color: "#64748b" }}>Last Updated: February 2026</p>

                <section style={{ marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#334155" }}>1. Introduction</h2>
                    <p style={{ lineHeight: "1.6" }}>
                        At <strong>Aspirant-Saathi</strong>, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.
                    </p>
                </section>

                <section style={{ marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#334155" }}>2. Information We Collect</h2>
                    <ul style={{ listStyleType: "disc", paddingLeft: "20px", marginTop: "10px", lineHeight: "1.6" }}>
                        <li><strong>Personal Information:</strong> Name, email address, phone number, and profile image when you register.</li>
                        <li><strong>Usage Data:</strong> Information about your interactions with the platform, such as questions submitted and features used.</li>
                        <li><strong>Content:</strong> Answer scripts (text or images) that you upload for evaluation.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#334155" }}>3. How We Use Your Information</h2>
                    <p style={{ lineHeight: "1.6" }}>
                        We use the collected data to:
                    </p>
                    <ul style={{ listStyleType: "disc", paddingLeft: "20px", marginTop: "10px", lineHeight: "1.6" }}>
                        <li>Provide and improve our AI evaluation services.</li>
                        <li>Authenticate your account and ensure security.</li>
                        <li>Communicate with you regarding updates, support, or account-related issues.</li>
                        <li>Analyze usage patterns to enhance user experience.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#334155" }}>4. Data Security</h2>
                    <p style={{ lineHeight: "1.6" }}>
                        We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                    </p>
                </section>

                <section style={{ marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#334155" }}>5. Sharing of Information</h2>
                    <p style={{ lineHeight: "1.6" }}>
                        We do not sell or rent your personal information to third parties. We may share data with trusted service providers (e.g., cloud hosting, email services) solely for the purpose of operating our platform, subject to strict confidentiality agreements.
                    </p>
                </section>

                <section style={{ marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#334155" }}>6. Your Rights</h2>
                    <p style={{ lineHeight: "1.6" }}>
                        You have the right to access, update, or delete your personal information. If you wish to exercise these rights, please contact us.
                    </p>
                </section>

                <section style={{ marginBottom: "30px", borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
                    <p style={{ lineHeight: "1.6" }}>
                        If you have any questions about this Privacy Policy, please contact us at <a href="mailto:aspirantsaathisuppport@gmail.com" style={{ color: "#3b82f6", textDecoration: "none" }}>aspirantsaathisuppport@gmail.com</a>.
                    </p>
                </section>
            </div>
        </div>
    );
}
