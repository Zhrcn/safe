"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { getDistributorProfile, updateDistributorInventory } from '@/store/services/distributorApi';
import { getMedicines } from '@/store/services/doctor/medicineApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { ClipboardList, Plus, Trash2, Save, Edit, Eye } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { NotFoundException } from '@zxing/library';
import Quagga from 'quagga';

const BarcodeScanner = dynamic(() => import('react-qr-barcode-scanner'), { ssr: false });

export default function DistributorInventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newItem, setNewItem] = useState({ medicine: '', quantity: '', price: '' });
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [barcodeError, setBarcodeError] = useState('');
  const barcodeInputRef = useRef(null);
  const [lastScanned, setLastScanned] = useState('');
  const [quaggaModalOpen, setQuaggaModalOpen] = useState(false);
  const [quaggaError, setQuaggaError] = useState('');
  const [quaggaLastScan, setQuaggaLastScan] = useState('');
  const [lastScanResult, setLastScanResult] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    getDistributorProfile()
      .then(res => setInventory(res.data.data.inventory || []))
      .catch(() => setError('Failed to load inventory'))
      .finally(() => setLoading(false));
    getMedicines().then(res => setMedicines(res.data || res)).catch(() => setMedicines([]));
  }, []);

  const filteredInventory = useMemo(() => {
    if (!search) return inventory;
    return inventory.filter(item =>
      (item.medicine?.name || item.medicine || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [inventory, search]);

  const handleChange = (idx, field, value) => {
    setInventory(inv =>
      inv.map((item, i) =>
        i === idx
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const handleRemove = idx => {
    setInventory(inv => inv.filter((_, i) => i !== idx));
  };

  const handleAdd = () => {
    if (
      !newItem.medicine ||
      newItem.quantity === '' ||
      newItem.price === '' ||
      isNaN(Number(newItem.quantity)) ||
      isNaN(Number(newItem.price)) ||
      Number(newItem.quantity) < 0 ||
      Number(newItem.price) < 0
    )
      return;
    setInventory(inv => [
      ...inv,
      {
        medicine: newItem.medicine, 
        quantity: Number(newItem.quantity),
        price: Number(newItem.price),
      },
    ]);
    setNewItem({ medicine: '', quantity: '', price: '' });
  };

  const handleSave = async () => {
    setSuccess('');
    setError('');
    setSaving(true);
    try {
      const cleanedInventory = inventory
        .filter(item => typeof item === 'object' && item !== null && 'medicine' in item)
        .map(item => ({
          medicine: item.medicine, 
          quantity: Number(item.quantity) || 0,
          price: Number(item.price) || 0
        }));
      await updateDistributorInventory(cleanedInventory);
      setSuccess('Inventory updated!');
      setEditMode(false);
    } catch {
      setError('Failed to update inventory.');
    }
    setSaving(false);
  };

  const handleBarcode = (barcode) => {
    setBarcodeError('');
    setLastScanned(barcode);
    setLastScanResult(barcode);
    const med = medicines.find(m => m.barcode === barcode);
    if (med) {
      setNewItem(item => ({ ...item, medicine: med._id }));
      setBarcodeModalOpen(false);
      if (barcodeInputRef.current) barcodeInputRef.current.value = '';
    } else {
      setBarcodeError('No medicine found for this barcode.');
    }
  };

  const handleQuaggaDetected = (barcode) => {
    setQuaggaLastScan(barcode);
    setLastScanResult(barcode);
    setBarcodeError('');
    const med = medicines.find(m => m.barcode === barcode);
    if (med) {
      setNewItem(item => ({ ...item, medicine: med._id }));
      setQuaggaModalOpen(false);
    } else {
      setBarcodeError('No medicine found for this barcode.');
    }
  };

  const getMedicineName = (medicineId) => {
    const medicine = medicines.find(m => m._id === medicineId);
    return medicine ? medicine.name : 'Unknown Medicine';
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
            <ClipboardList className="w-8 h-8 text-primary" />
            Distributor Inventory
          </h1>
          <p className="text-muted-foreground">
            Manage your inventory of medicines and packages. <span className="hidden sm:inline">Add, edit, or remove items below.</span>
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search by medicine name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          {editMode && (
            <>
              <Button variant="outline" onClick={() => setBarcodeModalOpen(true)}>
                Scan QR
              </Button>
              <Button variant="outline" onClick={() => setQuaggaModalOpen(true)}>
                Scan Barcode
              </Button>
            </>
          )}
          <Button 
            variant={editMode ? "secondary" : "primary"}
            onClick={() => setEditMode(!editMode)}
            className="flex items-center gap-2"
          >
            {editMode ? <Eye className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            {editMode ? 'View Mode' : 'Edit Mode'}
          </Button>
        </div>
      </div>
      {quaggaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-2">Scan 1D Barcode (UPC/EAN/Code128)</h2>
            <QuaggaScanner
              onDetected={handleQuaggaDetected}
              onError={setQuaggaError}
            />
            <Button variant="secondary" className="mt-4" onClick={() => setQuaggaModalOpen(false)}>
              Close
            </Button>
            {quaggaError && <div className="text-red-500 mt-2">{quaggaError}</div>}
            <div className="text-xs text-yellow-700 mt-2">
              Tip: Hold the barcode horizontally and fill as much of the frame as possible. Good lighting and focus are important!
            </div>
            {lastScanResult && (
              <div className="mt-4 text-sm text-primary font-mono break-all border-t pt-2">
                Last scanned: {lastScanResult}
              </div>
            )}
          </div>
        </div>
      )}
      {barcodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-2">Scan Medicine Barcode</h2>
            <ZXingBarcodeScanner onDetected={handleBarcode} onError={setBarcodeError} />
            <Button variant="secondary" className="mt-4" onClick={() => setBarcodeModalOpen(false)}>
              Close
            </Button>
            {barcodeError && <div className="text-red-500 mt-2">{barcodeError}</div>}
            <div className="text-xs text-yellow-700 mt-2">
              Tip: For 1D barcodes (UPC/EAN/Code128), hold the barcode horizontally and fill as much of the frame as possible. Good lighting and focus are important!
            </div>
            {lastScanResult && (
              <div className="mt-4 text-sm text-primary font-mono break-all border-t pt-2">
                Last scanned: {lastScanResult}
              </div>
            )}
          </div>
        </div>
      )}
      {editMode && (
        <div className="flex items-center gap-2 mb-4">
          <label htmlFor="barcode-input" className="text-sm font-medium">Barcode (USB scanner):</label>
          <Input
            id="barcode-input"
            ref={barcodeInputRef}
            placeholder="Scan or type barcode"
            onKeyDown={e => {
              if (e.key === 'Enter') handleBarcode(e.target.value);
            }}
            className="w-48"
          />
          <BarcodeReader
            onError={() => setBarcodeError('Barcode scan failed.')}
            onScan={barcode => barcode && handleBarcode(barcode)}
          />
          {barcodeError && <span className="text-red-500 ml-2">{barcodeError}</span>}
          {lastScanned && <span className="text-xs ml-2">Last scanned: <span className="font-mono">{lastScanned}</span></span>}
        </div>
      )}
      <Card className="shadow-2xl border border-primary/10">
        <CardHeader className="flex flex-row items-center gap-4 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-xl">
          <ClipboardList className="w-8 h-8 text-secondary" />
          <CardTitle className="text-2xl font-bold">Inventory Management</CardTitle>
          {editMode && (
            <Badge variant="secondary" className="ml-auto">
              Edit Mode
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground py-12 text-lg animate-pulse">Loading inventory...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-muted mb-4">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-1/2">Medicine/Package</TableHead>
                      <TableHead className="w-1/6 text-center">Quantity</TableHead>
                      <TableHead className="w-1/6 text-center">Price</TableHead>
                      {editMode && <TableHead className="w-1/6 text-center">Remove</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={editMode ? 4 : 3} className="text-center text-muted-foreground py-6">
                          No inventory items found.
                        </TableCell>
                      </TableRow>
                    )}
                    {filteredInventory.map((item, idx) => (
                      <TableRow
                        key={idx}
                        className="hover:bg-primary/5 transition-colors"
                      >
                        <TableCell>
                          {editMode ? (
                            <Select
                              value={item.medicine}
                              onValueChange={val => handleChange(idx, 'medicine', val)}
                            >
                              <SelectTrigger className="bg-white/80">
                                <SelectValue placeholder="Select medicine" />
                              </SelectTrigger>
                              <SelectContent>
                                {medicines.map(med => (
                                  <SelectItem key={med._id} value={med._id}>
                                    {med.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="font-medium">{getMedicineName(item.medicine)}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {editMode ? (
                            <Input
                              type="number"
                              min={0}
                              value={item.quantity}
                              onChange={e => handleChange(idx, 'quantity', e.target.value.replace(/^0+/, ''))}
                              required
                              className="bg-white/80 text-center"
                              inputMode="numeric"
                              pattern="[0-9]*"
                            />
                          ) : (
                            <span className="font-semibold">{item.quantity}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {editMode ? (
                            <Input
                              type="number"
                              min={0}
                              value={item.price}
                              onChange={e => handleChange(idx, 'price', e.target.value.replace(/^0+/, ''))}
                              required
                              className="bg-white/80 text-center"
                              inputMode="decimal"
                              pattern="[0-9.]*"
                            />
                          ) : (
                            <span className="font-semibold">${item.price}</span>
                          )}
                        </TableCell>
                        {editMode && (
                          <TableCell className="text-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => handleRemove(idx)}
                              className="transition-transform hover:scale-110"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                    {editMode && (
                      <TableRow className="bg-muted/30">
                        <TableCell>
                          <Select
                            value={newItem.medicine}
                            onValueChange={val => setNewItem({ ...newItem, medicine: val })}
                          >
                            <SelectTrigger className="bg-white/90">
                              <SelectValue placeholder="Select medicine" />
                            </SelectTrigger>
                            <SelectContent>
                              {medicines.map(med => (
                                <SelectItem key={med._id} value={med._id}>
                                  {med.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            min={0}
                            placeholder="Qty"
                            value={newItem.quantity}
                            onChange={e => setNewItem({ ...newItem, quantity: e.target.value.replace(/^0+/, '') })}
                            className="bg-white/90 text-center"
                            inputMode="numeric"
                            pattern="[0-9]*"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            min={0}
                            placeholder="Price"
                            value={newItem.price}
                            onChange={e => setNewItem({ ...newItem, price: e.target.value.replace(/^0+/, '') })}
                            className="bg-white/90 text-center"
                            inputMode="decimal"
                            pattern="[0-9.]*"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            type="button"
                            variant="success"
                            size="icon"
                            onClick={handleAdd}
                            className="transition-transform hover:scale-110"
                            aria-label="Add item"
                            disabled={
                              !newItem.medicine ||
                              newItem.quantity === '' ||
                              newItem.price === '' ||
                              isNaN(Number(newItem.quantity)) ||
                              isNaN(Number(newItem.price)) ||
                              Number(newItem.quantity) < 0 ||
                              Number(newItem.price) < 0
                            }
                          >
                            <Plus className="w-5 h-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {editMode && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      variant="primary"
                      className="flex items-center gap-2 px-6 py-2 text-base font-semibold shadow-lg"
                      disabled={saving}
                    >
                      <Save className="w-5 h-5" />
                      {saving ? 'Saving...' : 'Save Inventory'}
                    </Button>
                    {success && (
                      <Badge variant="success" className="flex items-center gap-1 animate-fade-in">
                        {success}
                      </Badge>
                    )}
                    {error && (
                      <Badge variant="destructive" className="flex items-center gap-1 animate-fade-in">
                        {error}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 sm:mt-0">
                    <span className="font-medium">Tip:</span> Click <span className="font-bold">Save Inventory</span> to persist your changes.
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ZXingBarcodeScanner({ onDetected, onError }) {
  const videoRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [deviceError, setDeviceError] = useState('');

  function getFriendlyCameraError(errorMsg) {
    if (!errorMsg) return '';
    if (/permission|denied/i.test(errorMsg)) {
      return 'Camera access was denied. Please allow camera access in your browser settings and refresh the page.';
    }
    if (/in use|allocate|videosource|not available/i.test(errorMsg)) {
      return 'Camera is already in use or cannot be accessed. Close other apps/tabs using the camera, unplug/replug the camera, and try again.';
    }
    if (/not found|no camera/i.test(errorMsg)) {
      return 'No camera found. Please connect a camera and refresh the page.';
    }
    return errorMsg;
  }

  useEffect(() => {
    let codeReader = new BrowserMultiFormatReader();
    let controls;
    let active = true;
    (async () => {
      try {
        const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
        setDevices(videoInputDevices);
        console.log('Available video input devices:', videoInputDevices);
        if (!videoInputDevices.length) {
          setDeviceError('No camera found');
          onError('No camera found');
          return;
        }
        const deviceId = selectedDeviceId || videoInputDevices[0].deviceId;
        setSelectedDeviceId(deviceId);
        controls = await codeReader.decodeFromVideoDevice(
          deviceId,
          videoRef.current,
          (result, err) => {
            if (!active) return;
            if (result) {
              onDetected(result.getText());
              if (controls) controls.stop();
            } else if (err && !(err instanceof NotFoundException || (err && err.name === 'NotFoundException'))) {
              setDeviceError(getFriendlyCameraError(err.message));
              onError(err.message || 'Barcode scan error');
            }
          },
          {
            video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
          }
        );
      } catch (e) {
        setDeviceError(getFriendlyCameraError(e.message));
        onError(e.message || 'Camera error');
      }
    })();
    return () => {
      active = false;
      if (controls) controls.stop();
    };
  }, [onDetected, onError, selectedDeviceId]);

  return (
    <div>
      {deviceError && (
        <div className="text-red-500 mb-2">
          Camera could not be accessed. Please check your camera and try again.
        </div>
      )}
      <video ref={videoRef} style={{ width: 350, height: 250, borderRadius: 8, background: '#000' }} />
      <div className="text-xs text-yellow-700 mt-2">
        Tip: For 1D barcodes (UPC/EAN/Code128), hold the barcode horizontally and fill as much of the frame as possible. Good lighting and focus are important!
      </div>
    </div>
  );
}

function QuaggaScanner({ onDetected, onError }) {
  const scannerRef = useRef(null);
  useEffect(() => {
    let active = true;
    Quagga.init({
      inputStream: {
        type: 'LiveStream',
        target: scannerRef.current,
        constraints: {
          width: 640,
          height: 480,
          facingMode: 'environment',
        },
      },
      decoder: {
        readers: [
          'code_128_reader',
          'ean_reader',
          'ean_8_reader',
          'upc_reader',
          'upc_e_reader',
        ],
      },
      locate: true,
    }, (err) => {
      if (err) {
        onError(err.message || 'Quagga init error');
        return;
      }
      Quagga.start();
    });
    Quagga.onDetected((data) => {
      if (!active) return;
      const code = data.codeResult.code;
      onDetected(code);
      Quagga.stop();
    });
    Quagga.onProcessed((result) => {
    });
    return () => {
      active = false;
      Quagga.offDetected();
      Quagga.stop();
    };
  }, [onDetected, onError]);
  return <div ref={scannerRef} style={{ width: 350, height: 250, borderRadius: 8, background: '#000' }} />;
}