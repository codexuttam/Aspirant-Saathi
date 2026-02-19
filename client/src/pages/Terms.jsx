import React from "react";
import Navbar from "../components/Navbar";
import "../styles/Home.css"; // Reusing basic styles or we can add inline

export default function Terms() {
    return (
        <div className="page-wrapper">
            <Navbar />
            <div className="content-container" style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", fontFamily: "Inter, sans-serif", color: "#334155" }}>
                <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "20px", color: "#1e293b" }}>Terms of Service</h1>
                <p style={{ marginBottom: "10px", color: "#64748b" }}>Last Updated: February 2026</p>

                <section style={{ marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#334155" }}>1. Acceptance of Terms</h2>
                    <p style={{ lineHeight: "1.6" }}>
                        By accessing and using <strong>Aspirant-Saathi</strong> ("we," "our," or "us"), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                    </p>
                </section>

                <section style={{ marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#334155" }}>2. Use of Services</h2>
                    <p style={{ lineHeight: "1.6" }}>
                        Aspirant-Saathi provides AI-powered answer evaluation for competitive exams. You agree to use our platform only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the platform.
                    </p>
                    <ul style={{ listStyleType: "disc", paddingLeft: "20px", marginTop: "10px", lineHeight: "1.6" }}>
                        <li>You must be at least 13 years old to use this service.</li>
                        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                        <li>You agree not to upload content that is offensive, illegal, or violates intellectual property rights.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#334155" }}>3. AI Evaluation Disclaimer</h2>
                    <p style={{ lineHeight: "1.6" }}>
                        Our services utilize Artificial Intelligence to evaluate answers. While we strive for accuracy, AI feedback may occasionally be incorrect or incomplete. The evaluations provided are for educational purposes only and should not be considered as official marking or professional advice. We are not liable for any discrepancies in actual exam results.
                    </p>
                </section>

                <section style={{ marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#334155" }}>4. Intellectual Property</h2>
                    <p style={{ lineHeight: "1.6" }}>
                        All content, trademarks, and data on this platform, including the AI evaluation algorithms, are the property of Aspirant-Saathi. User-submitted answers remain the intellectual property of the user, but you grant us a non-exclusive license to use them for improving our services.
                    </p>
                </section>

                <section style={{ marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#334155" }}>5. Limitation of Liability</h2>
                    <p style={{ lineHeight: "1.6" }}>
                        Aspirant-Saathi shall not be held liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform or reliance on the AI-generated feedback.
                    </p>
                </section>

                <section style={{ marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#334155" }}>6. Changes to Terms</h2>
                    <p style={{ lineHeight: "1.6" }}>
                        We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.
                    </p>
                </section>

                <section style={{ marginBottom: "30px", borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
                    <p style={{ lineHeight: "1.6" }}>
                        If you have any questions regarding these terms, please contact us at <a href="mailto:support@aspirantsaathi.com" style={{ color: "#3b82f6", textDecoration: "none" }}>support@aspirantsaathi.com</a>.
                    </p>
                </section>
            </div>
        </div>
    );
}
