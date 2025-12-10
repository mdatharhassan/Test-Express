import express from "express";
import Booking from "../model/bookingModel.js";
import userAuth from "../middleware/auth.js";
import { getToday } from "../utils/helper.js";

const bookingRouter = express.Router();

bookingRouter.get("/", userAuth, async (req, res) => {
  try {
    const PAGE_SIZE = 10;

    // Extract query params from URL
    const { page, sortBy, filter } = req.query;
    console.log(page, sortBy, filter);

    let queryObj = {};

    // ------------------------------
    // FILTER HANDLING
    // ------------------------------
    if (filter) {
      const parsed = JSON.parse(filter);

      // Example: { field: "status", value: "unconfirmed" }
      if (parsed.value === "all") {
        queryObj = {};
      }
      if (parsed.value === "checked-in") {
        queryObj[parsed.field] = parsed.value;
      }
      if (parsed.value === "checked-out") {
        queryObj[parsed.field] = parsed.value;
      }
      if (parsed.value === "unconfirmed") {
        queryObj[parsed.field] = parsed.value;
      }
    }

    // ------------------------------
    // BASE QUERY
    // ------------------------------
    let mongoQuery = Booking.find(queryObj)
      .select(
        "id created_at startDate endDate numNights isPaid numGuests status totalPrice"
      )
      .populate("cabinId", "name") // cabins(name)
      .populate("guestId", "fullName email");

    // ------------------------------
    // SORTING
    // ------------------------------
    if (sortBy) {
      const parsedSort = JSON.parse(sortBy);
      const direction = parsedSort.direction === "asc" ? 1 : -1;
      mongoQuery = mongoQuery.sort({ [parsedSort.field]: direction });
    }

    // ------------------------------
    // PAGINATION
    // ------------------------------
    if (page) {
      const p = Number(page);
      const skip = (p - 1) * PAGE_SIZE;
      mongoQuery = mongoQuery.skip(skip).limit(PAGE_SIZE);
    }

    // RUN PARALLEL QUERY + COUNT
    const [data, count] = await Promise.all([
      mongoQuery.exec(),
      Booking.countDocuments(queryObj),
    ]);

    res.json({ data, count });
  } catch (error) {
    console.error("Get Bookings Error:", error);
    res.status(500).json({ message: "Failed to load bookings" });
  }
});

bookingRouter.get("/:id", userAuth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("cabinId") // cabins(*)
      .populate("guestId"); // guests(*)
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({
      message: "Booking could not be retrieved",
      error: error.message,
    });
  }
});

bookingRouter.put("/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const obj = req.body;
    console.log(obj);
    const updatedBooking = await Booking.findByIdAndUpdate(id, obj, {
      new: true,
      runValidators: true,
    })
      .populate("cabinId")
      .populate("guestId");
    console.log(updatedBooking);

    if (!updatedBooking) {
      throw new Error("Booking could not be updated");
    }

    return res.status(200).json(updatedBooking);
  } catch (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
});

bookingRouter.get("/after-date/:date", userAuth, async (req, res) => {
  const { date } = req.params;
  console.log(date);

  try {
    const bookings = await Booking.find(
      {
        created_at: {
          $gte: new Date(date),
          $lte: new Date(getToday({ end: true })),
        },
      },
      "created_at totalPrice extrasPrice" // select fields
    );
    console.log(bookings);

    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Bookings could not be loaded", error: error.message });
  }
});

bookingRouter.get("/stays-after-date/:date", userAuth, async (req, res) => {
  try {
    const { date } = req.params;

    const bookings = await Booking.find({
      startDate: {
        $gte: new Date(date),
        $lte: new Date(getToday({ end: true })),
      },
    }).populate("guestId", "fullName");
    // const bookings = await Booking.find({}, { startDate: 1 });
    // console.log(bookings);

    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Bookings could not be loaded", error: error.message });
  }
});

bookingRouter.get("/booking/stays-today", userAuth, async (req, res) => {
  try {
    const todayStart = new Date(getToday());
    const todayEnd = new Date(getToday({ end: true }));

    const bookings = await Booking.find({
      $or: [
        // 1️⃣ Arrivals today
        {
          status: "unconfirmed",
          startDate: { $gte: todayStart, $lte: todayEnd },
        },
        // 2️⃣ Departures today
        {
          status: "checked-in",
          endDate: { $gte: todayStart, $lte: todayEnd },
        },
      ],
    })
      .populate("guestId", "fullName nationality countryFlag")
      .sort({ startDate: 1 }); // order("created_at")

    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Bookings could not be loaded", error: error.message });
  }
});

bookingRouter.delete("/:id", userAuth, async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Booking could not be deleted", error: error.message });
  }
});

export default bookingRouter;
