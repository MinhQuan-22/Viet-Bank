import { fbDb } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

export interface Cinema {
  id: string;
  name: string;
  address: string;
  cityKey: string;
  lat: number;
  lon: number;
  rooms: number;
  rating: number;
}

export interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: number;
  rating: string;
  description: string;
  posterUrl: string;
  trailerUrl?: string;
  images?: string[];
}

export interface Showtime {
  id: string;
  cinemaId: string;
  movieId: string;
  date: string;
  time: string;
  room: number;
  totalSeats: number;
  occupiedSeats: string[];
  pricePerSeat: number;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: "available" | "occupied" | "selected";
}

export async function searchCinemas(cityKey: string): Promise<Cinema[]> {
  try {
    const cinemasRef = collection(fbDb, "cinemas");
    const q = query(cinemasRef, where("cityKey", "==", cityKey));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Cinema,
    );
  } catch (error) {
    throw new Error("Không thể tải danh sách rạp phim");
  }
}

export async function getMoviesByCinema(cinemaId: string): Promise<Movie[]> {
  try {
    const showtimesRef = collection(fbDb, "showtimes");
    const q = query(showtimesRef, where("cinemaId", "==", cinemaId));
    const snapshot = await getDocs(q);

    const movieIds = new Set<string>();
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.movieId) {
        movieIds.add(data.movieId);
      }
    });

    // TODO: optimize with batch get instead of loop
    const movies: Movie[] = [];
    for (const movieId of movieIds) {
      const movieDoc = await getDoc(doc(fbDb, "movies", movieId));
      if (movieDoc.exists()) {
        movies.push({
          id: movieDoc.id,
          ...movieDoc.data(),
        } as Movie);
      }
    }

    return movies;
  } catch (error) {
    throw new Error("Không thể tải danh sách phim");
  }
}

export async function getShowtimesByMovie(
  cinemaId: string,
  movieId: string,
): Promise<Showtime[]> {
  try {
    const showtimesRef = collection(fbDb, "showtimes");
    const q = query(
      showtimesRef,
      where("cinemaId", "==", cinemaId),
      where("movieId", "==", movieId),
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Showtime,
    );
  } catch (error) {
    throw new Error("Không thể tải lịch chiếu");
  }
}

export async function getSeatMap(showtimeId: string): Promise<Seat[]> {
  try {
    const showtimeDoc = await getDoc(doc(fbDb, "showtimes", showtimeId));

    if (!showtimeDoc.exists()) {
      throw new Error("Suất chiếu không tồn tại");
    }

    const data = showtimeDoc.data() as Showtime;
    const occupiedSeats = new Set(data.occupiedSeats || []);

    const seats: Seat[] = [];
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];

    for (const row of rows) {
      for (let num = 1; num <= 12; num++) {
        const seatId = `${row}${num}`;
        seats.push({
          id: seatId,
          row,
          number: num,
          status: occupiedSeats.has(seatId) ? "occupied" : "available",
        });
      }
    }

    return seats;
  } catch (error) {
    throw new Error("Không thể tải sơ đồ ghế");
  }
}

// Find cinemas showing a specific movie
export async function searchCinemasByMovie(
  movieName: string,
  cityKey?: string,
): Promise<Cinema[]> {
  try {
    const moviesRef = collection(fbDb, "movies");
    const moviesSnapshot = await getDocs(moviesRef);

    const matchingMovies = moviesSnapshot.docs
      .filter((doc) => {
        const movie = doc.data() as Movie;
        return movie.title.toLowerCase().includes(movieName.toLowerCase());
      })
      .map((doc) => doc.id);

    if (matchingMovies.length === 0) return [];

    // FIXME: this loads all showtimes, should add index on movieId
    const showtimesRef = collection(fbDb, "showtimes");
    const cinemaIds = new Set<string>();

    await Promise.all(
      matchingMovies.map(async (movieId) => {
        const q = query(showtimesRef, where("movieId", "==", movieId));
        const snap = await getDocs(q);
        snap.docs.forEach((docSnap) => {
          const showtime = docSnap.data();
          if (showtime?.cinemaId) {
            cinemaIds.add(showtime.cinemaId);
          }
        });
      }),
    );

    const cinemas: Cinema[] = [];
    for (const cinemaId of cinemaIds) {
      const cinemaDoc = await getDoc(doc(fbDb, "cinemas", cinemaId));
      if (cinemaDoc.exists()) {
        const cinema = { id: cinemaDoc.id, ...cinemaDoc.data() } as Cinema;
        if (!cityKey || cinema.cityKey === cityKey) {
          cinemas.push(cinema);
        }
      }
    }

    return cinemas;
  } catch (error) {
    throw new Error("Không thể tìm rạp theo phim");
  }
}

export async function getAllMovies(): Promise<Movie[]> {
  try {
    const moviesRef = collection(fbDb, "movies");
    const snapshot = await getDocs(moviesRef);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Movie,
    );
  } catch (error) {
    throw new Error("Không thể tải danh sách phim");
  }
}
