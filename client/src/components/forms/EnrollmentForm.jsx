import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const EnrollmentForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState('starter');
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Get any referral ID from URL
  const [referrerId, setReferrerId] = useState('KG-2025-001');
  
  useEffect(() => {
    // Check for referrer ID in URL
    const urlParams = new URLSearchParams(window.location.search);
    const refId = urlParams.get('ref');
    if (refId) {
      setReferrerId(refId);
    }
  }, []);
  
  const onSubmit = (data) => {
    setIsSubmitting(true);
    
    // Add package information to data
    data.packageType = selectedPackage;
    
    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted with data:", data);
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Redirect to thank you page or show success message
      // window.location.href = '/thank-you';
    }, 1500);
  };
  
  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);
  
  if (submitted) {
    return (
      <div className="enrollment-success">
        <div className="bg-blue-700 text-white p-8 rounded-lg text-center shadow-lg max-w-xl mx-auto">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Pre-Enrollment Complete!</h2>
          <p className="text-xl mb-6">Thank you for reserving your position in Kevin's Konga!</p>
          <p className="mb-6">Your position has been secured. We'll contact you 3 days before the official launch (April 17, 2025) with instructions to complete your enrollment.</p>
          <p className="font-semibold">Welcome to the team!</p>
        </div>
      </div>
    );
  }
  
  return (
    <div id="enrollment-form" className="enrollment-form-container bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-blue-700 p-6 text-white">
          <h2 className="text-2xl font-bold text-center">Reserve Your Position Now</h2>
          <p className="text-center mt-2">Pre-enrollment ends April 17, 2025</p>
        </div>
        
        {/* Progress Steps */}
        <div className="px-8 py-4 bg-blue-50">
          <div className="flex justify-between">
            <div className={`step-item ${currentStep >= 1 ? 'active' : ''}`}>
              <div className={`step-circle ${currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}>1</div>
              <p className="step-text">Personal Info</p>
            </div>
            <div className="step-line"></div>
            <div className={`step-item ${currentStep >= 2 ? 'active' : ''}`}>
              <div className={`step-circle ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}>2</div>
              <p className="step-text">Contact Details</p>
            </div>
            <div className="step-line"></div>
            <div className={`step-item ${currentStep >= 3 ? 'active' : ''}`}>
              <div className={`step-circle ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}>3</div>
              <p className="step-text">Package Selection</p>
            </div>
            <div className="step-line"></div>
            <div className={`step-item ${currentStep >= 4 ? 'active' : ''}`}>
              <div className={`step-circle ${currentStep >= 4 ? 'bg-blue-600' : 'bg-gray-300'}`}>4</div>
              <p className="step-text">Confirmation</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Important:</strong> No payment information is required until 3 days before the official launch.
                </p>
              </div>
            </div>
          </div>
          
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="step-content">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    className={`w-full px-4 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    {...register('firstName', { required: 'First name is required' })}
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    className={`w-full px-4 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    {...register('lastName', { required: 'Last name is required' })}
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
                </div>
              </div>
              
              <div className="mt-6">
                <div className="form-group">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>
              </div>
              
              <div className="mt-6">
                <div className="form-group">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    {...register('phone', { required: 'Phone number is required' })}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Address */}
          {currentStep === 2 && (
            <div className="step-content">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Contact Details</h3>
              
              <div className="form-group">
                <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                <input
                  type="text"
                  id="streetAddress"
                  className={`w-full px-4 py-2 border ${errors.streetAddress ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...register('streetAddress', { required: 'Street address is required' })}
                />
                {errors.streetAddress && <p className="mt-1 text-sm text-red-600">{errors.streetAddress.message}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="form-group">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    id="city"
                    className={`w-full px-4 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    {...register('city', { required: 'City is required' })}
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="stateProvince" className="block text-sm font-medium text-gray-700 mb-1">State/Province *</label>
                  <input
                    type="text"
                    id="stateProvince"
                    className={`w-full px-4 py-2 border ${errors.stateProvince ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    {...register('stateProvince', { required: 'State/Province is required' })}
                  />
                  {errors.stateProvince && <p className="mt-1 text-sm text-red-600">{errors.stateProvince.message}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="form-group">
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal/Zip Code *</label>
                  <input
                    type="text"
                    id="postalCode"
                    className={`w-full px-4 py-2 border ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    {...register('postalCode', { required: 'Postal/Zip code is required' })}
                  />
                  {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <select
                    id="country"
                    className={`w-full px-4 py-2 border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
                    {...register('country', { required: 'Country is required' })}
                  >
                    <option value="">Select a country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="JP">Japan</option>
                    {/* Add more countries as needed */}
                  </select>
                  {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>}
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">Sponsor Information</h4>
                
                <div className="bg-blue-50 p-4 rounded mb-4">
                  <p className="text-blue-800">Your sponsor is: <strong>Kevin L. Gardner</strong> (ID: {referrerId})</p>
                </div>
                
                <div className="form-group">
                  <label htmlFor="sponsorId" className="block text-sm font-medium text-gray-700 mb-1">Update Sponsor ID (if applicable)</label>
                  <input
                    type="text"
                    id="sponsorId"
                    placeholder="Only if different from above"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('sponsorId')}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Package Selection */}
          {currentStep === 3 && (
            <div className="step-content">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Package Selection</h3>
              <p className="mb-6 text-gray-600">Select your preferred package. You can change this before the official launch.</p>
              
              <div className="space-y-6">
                {/* Starter Package */}
                <div 
                  className={`package-card border-2 rounded-lg p-6 cursor-pointer transition-all ${selectedPackage === 'starter' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                  onClick={() => setSelectedPackage('starter')}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-gray-800">Starter Package</h4>
                    <span className="text-xl font-bold text-yellow-600">$175 USD</span>
                  </div>
                  
                  <div className="mt-4">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Over 1,000 Professional Templates</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>1 Custom Video Email Template</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>5-Minute Recording Time</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>2,500 Contacts</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>2 GB Storage</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Monthly: $20 USD (10 SV)</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <div className={`h-6 w-6 rounded-full border border-blue-500 flex items-center justify-center ${selectedPackage === 'starter' ? 'bg-blue-500' : 'bg-white'}`}>
                      {selectedPackage === 'starter' && (
                        <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Elite Package */}
                <div 
                  className={`package-card border-2 rounded-lg p-6 cursor-pointer transition-all ${selectedPackage === 'elite' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                  onClick={() => setSelectedPackage('elite')}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-gray-800">Elite Package</h4>
                    <span className="text-xl font-bold text-yellow-600">$350 USD</span>
                  </div>
                  
                  <div className="mt-4">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Over 1,000 Professional Templates</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>3 Custom Video Email Templates</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>10-Minute Recording Time</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>5,000 Contacts</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>4 GB Storage</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Monthly: $40 USD (20 SV)</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <div className={`h-6 w-6 rounded-full border border-blue-500 flex items-center justify-center ${selectedPackage === 'elite' ? 'bg-blue-500' : 'bg-white'}`}>
                      {selectedPackage === 'elite' && (
                        <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Pro Package */}
                <div 
                  className={`package-card border-2 rounded-lg p-6 cursor-pointer transition-all ${selectedPackage === 'pro' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                  onClick={() => setSelectedPackage('pro')}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-gray-800">Pro Package</h4>
                    <span className="text-xl font-bold text-yellow-600">$700 USD</span>
                  </div>
                  
                  <div className="mt-4">
                    <ul className="space-y-2