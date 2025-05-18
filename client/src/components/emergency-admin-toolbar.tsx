import React from 'react';

export default function EmergencyAdminToolbar() {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#ff0000',
      padding: '15px',
      zIndex: 10000,
      borderTop: '5px solid yellow',
      boxShadow: '0 -4px 10px rgba(0,0,0,0.5)'
    }}>
      <div style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: '10px'
      }}>
        ADMIN CONTROL PANEL
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <a href="/admin/dashboard" style={{
          backgroundColor: '#0066ff',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          Admin Dashboard
        </a>
        <a href="/admin/products" style={{
          backgroundColor: '#00cc44',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          Manage Products
        </a>
        <a href="/admin/help-pages" style={{
          backgroundColor: '#9900cc',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          Edit Help Pages
        </a>
      </div>
    </div>
  );
}