-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 12, 2026 at 03:39 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tcm_learning`
--

-- --------------------------------------------------------

--
-- Table structure for table `exercises`
--

CREATE TABLE `exercises` (
  `id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `correct_answer` varchar(255) NOT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options`)),
  `exercise_type` enum('classification','balance','voice') DEFAULT 'classification',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exercises`
--

INSERT INTO `exercises` (`id`, `lesson_id`, `question_text`, `correct_answer`, `options`, `exercise_type`, `created_at`) VALUES
(1, 1, '发热 (Fever) belongs to?', 'yang', '[\"yang\",\"yin\"]', 'classification', '2026-03-12 10:06:42'),
(2, 1, '畏寒 (Chills) belongs to?', 'yin', '[\"yang\",\"yin\"]', 'classification', '2026-03-12 10:06:42'),
(3, 1, '头 (Head) belongs to?', 'yang', '[\"yang\",\"yin\"]', 'classification', '2026-03-12 10:06:42'),
(4, 1, '脚 (Feet) belongs to?', 'yin', '[\"yang\",\"yin\"]', 'classification', '2026-03-12 10:06:42'),
(5, 1, '背部 (Back) belongs to?', 'yang', '[\"yang\",\"yin\"]', 'classification', '2026-03-12 10:06:42'),
(6, 1, '腹部 (Belly) belongs to?', 'yin', '[\"yang\",\"yin\"]', 'classification', '2026-03-12 10:06:42'),
(7, 1, 'Say \"头在上，属阳\" in Chinese', '头在上，属阳', NULL, 'voice', '2026-03-12 10:06:42'),
(8, 1, 'Say \"气为阳，血为阴\" in Chinese', '气为阳，血为阴', NULL, 'voice', '2026-03-12 10:06:42');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(2, 'Mejbah', 'majba@gmail.com', '$2a$10$66JFhIdy85HQ4Erc9V5W8OnNmlAacbE28aaV18r0mzs/CZ06x7dQ.', '2026-03-12 11:36:47');

-- --------------------------------------------------------

--
-- Table structure for table `user_answers`
--

CREATE TABLE `user_answers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `exercise_id` int(11) NOT NULL,
  `user_answer` varchar(255) NOT NULL,
  `is_correct` tinyint(1) DEFAULT 0,
  `attempt_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_answers`
--

INSERT INTO `user_answers` (`id`, `user_id`, `exercise_id`, `user_answer`, `is_correct`, `attempt_date`) VALUES
(1, 2, 1, 'a', 0, '2026-03-12 13:47:52'),
(2, 2, 2, 'b', 0, '2026-03-12 13:47:56'),
(3, 2, 3, 'a', 0, '2026-03-12 13:48:03'),
(4, 2, 4, 'c', 0, '2026-03-12 13:48:08'),
(5, 2, 5, 'c', 0, '2026-03-12 13:49:02'),
(6, 2, 6, 'b', 0, '2026-03-12 13:49:05'),
(7, 2, 7, 'b', 0, '2026-03-12 13:49:09'),
(8, 2, 8, 'c', 0, '2026-03-12 13:49:13'),
(9, 2, 1, 'a', 0, '2026-03-12 13:50:40'),
(10, 2, 2, 'c', 0, '2026-03-12 13:50:42'),
(11, 2, 3, 'b', 0, '2026-03-12 13:50:44'),
(12, 2, 4, 'c', 0, '2026-03-12 13:50:48'),
(13, 2, 5, 'a', 0, '2026-03-12 13:50:51'),
(14, 2, 6, 'b', 0, '2026-03-12 13:50:53'),
(15, 2, 8, 'c', 0, '2026-03-12 13:50:59'),
(16, 2, 7, 'b', 0, '2026-03-12 13:51:03'),
(17, 2, 1, 'a', 0, '2026-03-12 13:56:13'),
(18, 2, 3, 'c', 0, '2026-03-12 13:56:25'),
(19, 2, 2, 'b', 0, '2026-03-12 13:56:25'),
(20, 2, 4, 'd', 0, '2026-03-12 13:56:25'),
(21, 2, 5, 'a', 0, '2026-03-12 13:56:25');

-- --------------------------------------------------------

--
-- Table structure for table `voice_assessments`
--

CREATE TABLE `voice_assessments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `exercise_id` int(11) NOT NULL,
  `audio_url` varchar(500) DEFAULT NULL,
  `transcript` text DEFAULT NULL,
  `accuracy_score` decimal(5,2) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `voice_assessments`
--

INSERT INTO `voice_assessments` (`id`, `user_id`, `exercise_id`, `audio_url`, `transcript`, `accuracy_score`, `feedback`, `created_at`) VALUES
(1, 2, 8, '/uploads/voice-1773315661866-86476495', '头在上，属阳', 95.83, 'Excellent pronunciation! Very clear and accurate.', '2026-03-12 11:41:01'),
(2, 2, 8, '/uploads/voice-1773315680148-454648203', '头在上，属阳', 98.55, 'Excellent pronunciation! Very clear and accurate.', '2026-03-12 11:41:20'),
(3, 2, 8, '/uploads/voice-1773315730087-352609413', '头在上，属阳', 82.16, 'Good attempt! Pay attention to tone and complete phrases.', '2026-03-12 11:42:10'),
(4, 2, 8, '/uploads/voice-1773315744959-766205577', '头在上，属阳', 79.69, 'Good attempt! Pay attention to tone and complete phrases.', '2026-03-12 11:42:24');

-- --------------------------------------------------------

--
-- Table structure for table `wrong_answers`
--

CREATE TABLE `wrong_answers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `exercise_id` int(11) NOT NULL,
  `wrong_answer` varchar(255) NOT NULL,
  `attempt_count` int(11) DEFAULT 1,
  `last_attempt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wrong_answers`
--

INSERT INTO `wrong_answers` (`id`, `user_id`, `exercise_id`, `wrong_answer`, `attempt_count`, `last_attempt`) VALUES
(1, 2, 1, 'a', 3, '2026-03-12 13:56:13'),
(2, 2, 2, 'b', 3, '2026-03-12 13:56:25'),
(3, 2, 3, 'a', 3, '2026-03-12 13:56:25'),
(4, 2, 4, 'c', 3, '2026-03-12 13:56:25'),
(5, 2, 5, 'c', 3, '2026-03-12 13:56:25'),
(6, 2, 6, 'b', 2, '2026-03-12 13:51:03'),
(7, 2, 7, 'b', 2, '2026-03-12 13:51:03'),
(8, 2, 8, 'c', 2, '2026-03-12 13:51:03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `exercises`
--
ALTER TABLE `exercises`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_answers`
--
ALTER TABLE `user_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `exercise_id` (`exercise_id`);

--
-- Indexes for table `voice_assessments`
--
ALTER TABLE `voice_assessments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `wrong_answers`
--
ALTER TABLE `wrong_answers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_exercise` (`user_id`,`exercise_id`),
  ADD KEY `exercise_id` (`exercise_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `exercises`
--
ALTER TABLE `exercises`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_answers`
--
ALTER TABLE `user_answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `voice_assessments`
--
ALTER TABLE `voice_assessments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `wrong_answers`
--
ALTER TABLE `wrong_answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user_answers`
--
ALTER TABLE `user_answers`
  ADD CONSTRAINT `user_answers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_answers_ibfk_2` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `voice_assessments`
--
ALTER TABLE `voice_assessments`
  ADD CONSTRAINT `voice_assessments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wrong_answers`
--
ALTER TABLE `wrong_answers`
  ADD CONSTRAINT `wrong_answers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wrong_answers_ibfk_2` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
