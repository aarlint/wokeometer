import React, { useState } from 'react';
import { FaBitcoin, FaCopy, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

const Donate = () => {
  const [copied, setCopied] = useState(false);
  
  // Placeholder Bitcoin address - replace with actual donation address
  const bitcoinAddress = "bc1qexampleaddressforanonymousdonationstowokeometer123";
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bitcoinAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaBitcoin className="w-10 h-10 text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Support Our Mission
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Support independent media assessment through anonymous Bitcoin donations
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
              <FaShieldAlt className="w-6 h-6 text-primary" />
              Why Anonymous Donations?
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                We believe in protecting our supporters' privacy and maintaining our platform's independence. 
                Anonymous Bitcoin donations ensure that:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  Your identity remains completely protected
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  No payment processors can pressure us to change our mission
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  We maintain true independence from corporate influence
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  Your support cannot be traced back to you
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              How Your Support Helps
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Your donations directly support our mission to provide transparent, 
                community-driven assessments of entertainment media:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  Platform hosting and development costs
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  Security infrastructure to protect user data
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  Research and analysis of entertainment trends
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  Expanding our assessment database
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bitcoin Address Section */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Bitcoin Donation Address
          </h2>
          
          <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 mb-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-lg mb-4">
                <FaBitcoin className="w-6 h-6 text-orange-500" />
                <span className="font-semibold text-orange-700 dark:text-orange-400">BTC Address</span>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 mb-4">
                <code className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
                  {bitcoinAddress}
                </code>
              </div>
              
              <button
                onClick={copyToClipboard}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-primary text-white hover:bg-primary-hover'
                }`}
              >
                {copied ? (
                  <>
                    <FaCheckCircle className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <FaCopy className="w-5 h-5" />
                    Copy Address
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2">
              <strong>Important:</strong> Only send Bitcoin (BTC) to this address.
            </p>
            <p>
              Sending other cryptocurrencies may result in permanent loss of funds.
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
            New to Bitcoin?
          </h3>
          <p className="text-blue-800 dark:text-blue-300 mb-4">
            Bitcoin provides the ultimate financial privacy and cannot be censored by traditional payment processors. 
            Here are some trusted ways to get started:
          </p>
          <ul className="space-y-2 text-blue-800 dark:text-blue-300">
            <li>• Popular exchanges: Coinbase, Kraken, Binance</li>
            <li>• Privacy-focused options: Bisq, LocalBitcoins</li>
            <li>• Hardware wallets for security: Ledger, Trezor</li>
          </ul>
        </div>

        {/* Mission Statement */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Our Commitment to You
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            We are committed to maintaining a platform that serves our community without compromise. 
            Your anonymous support allows us to continue providing honest, transparent assessments 
            free from corporate influence or political pressure.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Together, we can help viewers make informed entertainment choices and support creators 
            who prioritize quality storytelling over ideological messaging.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Donate; 