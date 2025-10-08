import React, { useState } from 'react';
import "../assets/css/ContactUs.css";
import Banner from '../components/common/Banner';
import { useDispatch } from 'react-redux';
import { FaUserAltSlash, FaPhone, FaMailBulk, FaDropbox ,FaEnvelope} from 'react-icons/fa';
import { sendCompanyMessage } from '../redux/reducers/contactUsSlice';
import { toast } from 'react-toastify';
import contactUs from "../assets/images/contactUs.avif";

const ContactUs = () => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(sendCompanyMessage({ formData: form })).unwrap();
      toast.success('🎉 Message sent successfully!', { position: 'top-center', theme: 'colored' });
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('❌ Failed to send message.', { position: 'top-center', theme: 'colored' });
    }
  };

  return (
    <div className="contactus-page">
      <Banner />
      <section className="contactFormSection">
        <form onSubmit={handleSubmit} className="contactUsForm row mx-auto">
          {/* Image + Company Info */}
          <div className="col-md-6 col-sm-12 imageContainer">
            <img src={contactUs} className="img-fluid contactUsImage" alt="Contact Us" />
            <div>
              <div>
                <h2 className="descriptionText">Let's start the conversation</h2>
                <p className="descriptionText">Have question? or Feedback We are always here.</p>
              </div>
              {/* <div>
                <FaPhone size={20} />
                <label className="descriptionText">Let's Talk</label>
                <span className="descriptionText">0310-1234567</span>
              </div>
              <div>
                <FaMailBulk size={20} />
                <label className="descriptionText">General Support</label>
                <span className="descriptionText">contact@xyz.com</span>
              </div> */}
            </div>
          </div>

          {/* Form */}
          <div className="col-md-6 col-sm-12 contactUs-inputForm">
            <h5>Contact Us</h5>
            <div className="form-outline mb-4">
              <FaUserAltSlash className="form-input-icon" />
              <input
                id="name"
                type="text"
                className="form-control"
                placeholder="Name *"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-outline mb-4">
              <FaEnvelope className="form-input-icon" />
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="Email *"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-outline mb-4">
              <FaDropbox className="form-input-icon" style={{ marginTop: '-31px' }} />
              <textarea
                id="message"
                rows="4"
                className="form-control"
                placeholder="Message *"
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="sendButton btn btn-primary">
              Send
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ContactUs;
