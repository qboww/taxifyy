export class UtilityService {
  constructor(defaultServices = [], savedState = null) {
    this.services = savedState?.services || [...defaultServices];
    this.history = savedState?.history || [];
  }

  getAll() {
    return this.services;
  }

  getHistory() {
    return this.history;
  }

  addService(service) {
    this.services.push(service);
  }

  removeService(index) {
    this.services.splice(index, 1);
  }

  updateService(index, field, value) {
    this.services[index][field] = value;
  }

  calculateDifferences(newReadings) {
    const lastEntry = this.history[this.history.length - 1];
    return newReadings.map((service, i) => {
      if (service.isFixed) return { ...service, diff: service.fixedAmount };
      const prevQuantity = lastEntry?.services[i]?.quantity || 0;
      const diff = parseFloat(service.quantity) - parseFloat(prevQuantity);
      return { ...service, diff: diff > 0 ? diff : 0 };
    });
  }

  calculate() {
    const perType = {};
    let totalCost = 0;

    this.services.forEach(({ type, coefficient, quantity, fixedAmount, isFixed, diff }) => {
      const used = diff ?? quantity;
      const cost = isFixed ? parseFloat(fixedAmount) || 0 : (parseFloat(coefficient) || 0) * (parseFloat(used) || 0);
      if (type) perType[type] = (perType[type] || 0) + cost;
      totalCost += cost;
    });

    return {
      items: Object.entries(perType).map(([label, value]) => ({ label, value })),
      subtotal: totalCost,
      total: totalCost,
    };
  }

  saveCurrentState() {
    const snapshot = {
      date: new Date().toISOString(),
      services: this.services.map(s => ({
        type: s.type,
        coefficient: s.coefficient,
        quantity: s.quantity,
        diff: s.diff,
        fixedAmount: s.fixedAmount,
        isFixed: s.isFixed,
        unit: s.unit
      })),
    };
    this.history.push(snapshot);
  }

  deleteHistory(index) {
    this.history.splice(index, 1);
  }

  toJSON() {
    return {
      services: this.services,
      history: this.history,
    };
  }
}
