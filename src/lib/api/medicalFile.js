function getAuthToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('safe_auth_token');
}

export async function getMedicalFileById(medicalFileId) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/medicalfiles/${medicalFileId}`, { // Using plural 'medicalfiles' and ID
        headers
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch medical file and parse error JSON' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json(); // Assuming API returns the medical file object directly or { data: medicalFileObject }
}

export async function getMedicalFile() {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/medical-file', {
        headers
    });

    if (!response.ok) {
        throw new Error('Failed to fetch medical file');
    }
    return response.json();
}

export async function getMedicalFileSection(section) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/medical-file/${section}`, {
        headers
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${section}`);
    }
    return response.json();
}

export async function addToMedicalFile(section, data) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/medical-file/${section}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`Failed to add ${section}`);
    }
    return response.json();
}

export async function updateMedicalFileItem(section, itemId, data) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/medical-file/${section}?id=${itemId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`Failed to update ${section}`);
    }
    return response.json();
}

export async function deleteMedicalFileItem(section, itemId) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/medical-file/${section}?id=${itemId}`, {
        method: 'DELETE',
        headers
    });

    if (!response.ok) {
        throw new Error(`Failed to delete ${section}`);
    }
    return response.json();
}

export async function updateMedicalFile(data) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/medical-file', {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to update medical file');
    }
    return response.json();
} 