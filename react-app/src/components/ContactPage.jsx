import { useState } from 'react';

const categories = [
    { value: 'press', label: 'PRESS INQUIRY' },
    { value: 'speaking', label: 'SPEAKING ENGAGEMENT' },
    { value: 'investment', label: 'INVESTMENT OPPORTUNITY' },
    { value: 'partnership', label: 'PARTNERSHIP' },
    { value: 'other', label: 'OTHER' },
];

export default function ContactPage({ isActive }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: wire up backend endpoint
        alert('Form submitted — backend integration pending.');
    };

    return (
        <section className={`contact-page ${isActive ? 'active' : ''}`} id="contactPage">
            <div className="contact-layout">
                <div className="contact-left">
                    <h1 className="contact-heading">
                        GET IN<br />TOUCH
                    </h1>
                    <p className="contact-subtitle">
                        I get a lot of messages and can't<br />reply to all of them, but I truly<br />appreciate the outreach.
                    </p>
                </div>
                <form className="contact-form" id="contactForm" onSubmit={handleSubmit}>
                    <div className="contact-input-group">
                        <input
                            className="contact-input"
                            type="text"
                            name="name"
                            placeholder="FULL NAME"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="contact-input-group">
                        <input
                            className="contact-input"
                            type="email"
                            name="email"
                            placeholder="EMAIL"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="contact-categories" id="contactCategories">
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                type="button"
                                className={`contact-category ${selectedCategory === cat.value ? 'selected' : ''}`}
                                onClick={() => setSelectedCategory(cat.value)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                    <textarea
                        className="contact-textarea"
                        name="message"
                        placeholder="Message"
                        rows="6"
                        value={formData.message}
                        onChange={handleInputChange}
                    />
                    <button type="submit" className="contact-submit">
                        SUBMIT
                    </button>
                </form>
            </div>
            <div className="contact-disclaimer">
                <p>
                    If you are interested in applying to my companies, please apply on their career web pages directly.
                </p>
                <p>
                    This site is protected by reCAPTCHA and the Google{' '}
                    <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a> apply.
                </p>
            </div>
        </section>
    );
}
