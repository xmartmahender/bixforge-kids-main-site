'use client';

import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaUniversity, FaCheck, FaTimes } from 'react-icons/fa';
import { getAvailableBanks, addBank, updateBank, deleteBank, BankInfo } from '../../../lib/subscriptionService';

export default function BankManagement() {
  const [banks, setBanks] = useState<BankInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBank, setEditingBank] = useState<BankInfo | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: ''
  });

  useEffect(() => {
    loadBanks();
  }, []);

  const loadBanks = async () => {
    try {
      const bankList = await getAvailableBanks();
      setBanks(bankList);
    } catch (error) {
      console.error('Error loading banks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBank = async () => {
    if (!formData.name.trim()) {
      alert('Please enter bank name');
      return;
    }

    try {
      await addBank(formData.name, formData.code);
      setFormData({ name: '', code: '' });
      setShowAddModal(false);
      loadBanks();
      alert('Bank added successfully!');
    } catch (error) {
      console.error('Error adding bank:', error);
      alert('Failed to add bank');
    }
  };

  const handleEditBank = async () => {
    if (!editingBank || !formData.name.trim()) {
      alert('Please enter bank name');
      return;
    }

    try {
      await updateBank(editingBank.id, {
        name: formData.name,
        code: formData.code
      });
      setFormData({ name: '', code: '' });
      setEditingBank(null);
      loadBanks();
      alert('Bank updated successfully!');
    } catch (error) {
      console.error('Error updating bank:', error);
      alert('Failed to update bank');
    }
  };

  const handleDeleteBank = async (bankId: string, bankName: string) => {
    if (confirm(`Are you sure you want to delete ${bankName}?`)) {
      try {
        await deleteBank(bankId);
        loadBanks();
        alert('Bank deleted successfully!');
      } catch (error) {
        console.error('Error deleting bank:', error);
        alert('Failed to delete bank');
      }
    }
  };

  const openEditModal = (bank: BankInfo) => {
    setEditingBank(bank);
    setFormData({
      name: bank.name,
      code: bank.code || ''
    });
  };

  const closeModals = () => {
    setShowAddModal(false);
    setEditingBank(null);
    setFormData({ name: '', code: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading banks...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaUniversity className="mr-3 text-blue-600" />
            Bank Management
          </h2>
          <p className="text-gray-600">Manage available banks for payment processing</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          Add Bank
        </button>
      </div>

      {/* Banks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {banks.map((bank) => (
          <div key={bank.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">{bank.name}</h3>
                {bank.code && (
                  <p className="text-sm text-gray-500">Code: {bank.code}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(bank)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Edit Bank"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteBank(bank.id, bank.name)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Delete Bank"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                bank.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {bank.isActive ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                {bank.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {banks.length === 0 && (
        <div className="text-center py-8">
          <FaUniversity className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Banks Available</h3>
          <p className="text-gray-500 mb-4">Add banks to enable payment processing</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add First Bank
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingBank) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingBank ? 'Edit Bank' : 'Add New Bank'}
              </h3>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter bank name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Code (Optional)
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter bank code"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeModals}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingBank ? handleEditBank : handleAddBank}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingBank ? 'Update' : 'Add'} Bank
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
