'use client';
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const PatientAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalPatients: 0,
    activePatients: 0,
    newPatients: 0,
    averageAge: 0,
    genderDistribution: [],
    conditionDistribution: [],
    monthlyTrends: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics/patient');
        if (!response.ok) throw new Error('Failed to fetch analytics');
        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-4 text-red-700 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Patients</h3>
          <p className="text-2xl font-semibold text-gray-900">{analytics.totalPatients}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Active Patients</h3>
          <p className="text-2xl font-semibold text-gray-900">{analytics.activePatients}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">New Patients</h3>
          <p className="text-2xl font-semibold text-gray-900">{analytics.newPatients}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Average Age</h3>
          <p className="text-2xl font-semibold text-gray-900">{analytics.averageAge}</p>
        </div>
      </div>
      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {}
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Gender Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.genderDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="gender" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {}
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Condition Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.conditionDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="condition" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {}
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Patient Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="newPatients" name="New Patients" fill="#3B82F6" />
              <Bar dataKey="activePatients" name="Active Patients" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
export default PatientAnalytics; 