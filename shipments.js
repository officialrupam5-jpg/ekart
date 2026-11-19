(function (global) {
  const storageKey = "ekartCourierShipments";
  const milestones = [
    { id: "orderPlaced", label: "Order Placed" },
    { id: "pickedUp", label: "Picked Up" },
    { id: "motherHub", label: "Reached Mother Hub" },
    { id: "leftDestination", label: "Left Destination" },
    { id: "inTransit", label: "In Transit" },
    { id: "destinationReached", label: "Reached Destination" },
    { id: "outForDelivery", label: "Out for Delivery" },
    { id: "delivered", label: "Delivered" }
  ];
  const sampleShipments = {
    EK1001: {
      status: "In Transit",
      orderId: "ORD-EK1001",
      badgeClass: "transit",
      step: 2,
      eta: "Nov 21, 2026 by 6:00 PM",
      milestoneDates: {
        orderPlaced: "2026-11-17T08:00:00+05:30",
        pickedUp: "2026-11-18T16:20:00+05:30",
        motherHub: "2026-11-18T23:40:00+05:30",
        leftDestination: "2026-11-19T06:00:00+05:30",
        inTransit: "2026-11-19T09:15:00+05:30"
      },
      buyerName: "Demo Recipient 1",
      customerName: "Demo Customer 1",
      orderItem: "Books",
      itemVerified: false,
      origin: "Mumbai, MH",
      destination: "Guwahati, AS",
      service: "Express Air • 2.4 kg",
      weight: 2.4,
      charge: 189.6,
      history: [
        { time: "Nov 19, 2026 • 09:15 AM", status: "Departed Regional Hub", location: "Kolkata Sorting Facility, WB" },
        { time: "Nov 18, 2026 • 11:40 PM", status: "Arrived at Transit Hub", location: "Kolkata Sorting Facility, WB" },
        { time: "Nov 18, 2026 • 04:20 PM", status: "Picked Up by Courier", location: "Andheri East, Mumbai, MH" },
        { time: "Nov 18, 2026 • 01:05 PM", status: "Shipping Label Created", location: "Mumbai, MH" }
      ]
    },
    EK2002: {
      status: "Delivered",
      orderId: "ORD-EK2002",
      badgeClass: "delivered",
      step: 4,
      eta: "Delivered on Nov 18, 2026",
      milestoneDates: {
        orderPlaced: "2026-11-16T10:00:00+05:30",
        pickedUp: "2026-11-17T15:00:00+05:30",
        motherHub: "2026-11-17T20:30:00+05:30",
        leftDestination: "2026-11-17T21:15:00+05:30",
        inTransit: "2026-11-18T01:00:00+05:30",
        destinationReached: "2026-11-18T06:45:00+05:30",
        outForDelivery: "2026-11-18T08:30:00+05:30",
        delivered: "2026-11-18T14:45:00+05:30"
      },
      buyerName: "Demo Recipient 2",
      customerName: "Demo Customer 2",
      orderItem: "Clothing",
      itemVerified: false,
      origin: "Bengaluru, KA",
      destination: "New Delhi, DL",
      service: "Priority Overnight • 0.8 kg",
      weight: 0.8,
      charge: 63.2,
      history: [
        { time: "Nov 18, 2026 • 02:45 PM", status: "Delivered - Signed by Recipient", location: "Connaught Place, New Delhi" },
        { time: "Nov 18, 2026 • 08:30 AM", status: "Out for Delivery", location: "New Delhi Local Depot" },
        { time: "Nov 17, 2026 • 10:15 PM", status: "Arrived at Destination Hub", location: "IGI Airport Cargo Hub, Delhi" },
        { time: "Nov 17, 2026 • 03:00 PM", status: "Shipment Picked Up", location: "Whitefield, Bengaluru, KA" }
      ]
    },
    EK3003: {
      status: "Delayed",
      orderId: "ORD-EK3003",
      badgeClass: "exception",
      step: 2,
      eta: "Updated: Nov 22, 2026",
      milestoneDates: {
        orderPlaced: "2026-11-15T09:00:00+05:30",
        pickedUp: "2026-11-16T14:15:00+05:30",
        motherHub: "2026-11-17T18:10:00+05:30",
        leftDestination: "2026-11-18T03:00:00+05:30",
        inTransit: "2026-11-19T07:00:00+05:30"
      },
      buyerName: "Demo Recipient 3",
      customerName: "Demo Customer 3",
      orderItem: "Home goods",
      itemVerified: false,
      origin: "Chennai, TN",
      destination: "Shillong, ML",
      service: "Standard Ground • 5.1 kg",
      weight: 5.1,
      charge: 402.9,
      history: [
        { time: "Nov 19, 2026 • 07:00 AM", status: "Transit Delayed Due to Heavy Rain", location: "Bhubaneswar Highway Hub, OD" },
        { time: "Nov 17, 2026 • 06:10 PM", status: "In Transit to Next Facility", location: "Visakhapatnam, AP" },
        { time: "Nov 16, 2026 • 02:15 PM", status: "Picked Up from Sender", location: "Guindy, Chennai, TN" }
      ]
    }
  };

  function load() {
    const saved = global.localStorage.getItem(storageKey);
    if (saved === null) {
      global.localStorage.setItem(storageKey, JSON.stringify(sampleShipments));
      return sampleShipments;
    }

    let data;
    try {
      data = JSON.parse(saved);
    } catch (error) {
      throw new Error("Saved shipment data is unreadable. Clear this site's saved data to start over.");
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new Error("Saved shipment data is invalid. Clear this site's saved data to start over.");
    }
    return data;
  }

  function save(shipments) {
    global.localStorage.setItem(storageKey, JSON.stringify(shipments));
  }

  function getMilestoneDates(shipment) {
    const savedDates = shipment && shipment.milestoneDates && typeof shipment.milestoneDates === "object"
      ? shipment.milestoneDates
      : {};
    const dates = {};
    milestones.forEach(milestone => {
      const value = savedDates[milestone.id];
      if (value && Number.isFinite(new Date(String(value).replace(/\s•\s/g, " ")).getTime())) {
        dates[milestone.id] = value;
      }
    });

    const history = shipment && Array.isArray(shipment.history) ? shipment.history : [];
    history.forEach(event => {
      if (!event || typeof event.status !== "string" || !event.time) return;
      const status = event.status.trim().toLowerCase();
      let milestoneId = null;
      if (/delivered/.test(status)) milestoneId = "delivered";
      else if (/out for delivery/.test(status)) milestoneId = "outForDelivery";
      else if (/(arrived|reached).*(destination)|(destination).*(hub)/.test(status)) milestoneId = "destinationReached";
      else if (/in transit|transit to/.test(status)) milestoneId = "inTransit";
      else if (/(left|departed).*(destination|hub|facility)/.test(status)) milestoneId = "leftDestination";
      else if (/mother hub|regional hub|transit hub|sorting facility|arrived.*hub|reached.*hub/.test(status)) milestoneId = "motherHub";
      else if (/picked.?up|collected from sender/.test(status)) milestoneId = "pickedUp";
      else if (/order placed|shipping label created/.test(status)) milestoneId = "orderPlaced";
      if (milestoneId && !dates[milestoneId]
        && Number.isFinite(new Date(String(event.time).replace(/\s•\s/g, " ")).getTime())) {
        dates[milestoneId] = event.time;
      }
    });

    if (!dates.orderPlaced && shipment && shipment.orderPlacedAt
      && Number.isFinite(new Date(shipment.orderPlacedAt).getTime())) {
      dates.orderPlaced = shipment.orderPlacedAt;
    }
    if (shipment && typeof shipment.status === "string") {
      const currentStatus = shipment.status.trim().toLowerCase();
      const currentMilestoneDefinition = milestones.find(milestone =>
        milestone.label.toLowerCase() === currentStatus
      );
      const currentMilestone = currentStatus === "delayed"
        ? "inTransit"
        : currentMilestoneDefinition
          ? currentMilestoneDefinition.id
          : null;
      const latestEvent = history
        .filter(event => event && event.time
          && Number.isFinite(new Date(String(event.time).replace(/\s•\s/g, " ")).getTime()))
        .sort((first, second) =>
          new Date(String(second.time).replace(/\s•\s/g, " ")).getTime()
          - new Date(String(first.time).replace(/\s•\s/g, " ")).getTime()
        )[0];
      if (currentMilestone && !dates[currentMilestone] && latestEvent) {
        dates[currentMilestone] = latestEvent.time;
      }
    }
    return dates;
  }

  global.EkartShipments = { load, save, milestones, getMilestoneDates };
})(window);
