-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 11, 2017 at 09:13 PM
-- Server version: 5.5.46-0ubuntu0.14.04.2
-- PHP Version: 5.5.9-1ubuntu4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `jobPortal`
--

-- --------------------------------------------------------

--
-- Table structure for table `appliedjobs`
--

CREATE TABLE IF NOT EXISTS `appliedjobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jobid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=29 ;

--
-- Dumping data for table `appliedjobs`
--

INSERT INTO `appliedjobs` (`id`, `jobid`, `userid`) VALUES
(25, 27, 6),
(26, 28, 7),
(27, 28, 8),
(28, 30, 6);

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE IF NOT EXISTS `employee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fname` varchar(255) NOT NULL,
  `lname` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `industryType` int(255) NOT NULL,
  `confirmation` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`id`, `username`, `password`, `fname`, `lname`, `gender`, `email`, `mobile`, `industryType`, `confirmation`) VALUES
(6, 'imrulkais', '12345678', 'Imrul', 'Kais', 'male', 'imrulkais@gmail.com', '01764123456', 1, 'confirmed'),
(7, 'mim02', '123456789', 'Sultana', 'Mim', 'female', 'mim@yahoo.com', '01763123456', 2, 'confirmed'),
(8, 'mari03', '123456789', 'Mari', 'Alexander', 'female', 'mari03@yahoo.com', '01765123456', 4, 'confirmed');

-- --------------------------------------------------------

--
-- Table structure for table `employeeAccount`
--

CREATE TABLE IF NOT EXISTS `employeeAccount` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `fathersName` varchar(255) NOT NULL,
  `mothersName` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `nationality` varchar(255) NOT NULL,
  `nationalidnumber` varchar(255) NOT NULL,
  `presentAddress` varchar(255) NOT NULL,
  `permanentAddress` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `objective` varchar(255) NOT NULL,
  `presentSalary` varchar(255) NOT NULL,
  `expectedSalary` varchar(255) NOT NULL,
  `joblevel` varchar(255) NOT NULL,
  `careerSummary` varchar(255) NOT NULL,
  `specialQualification` varchar(255) NOT NULL,
  `employeeid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `employeeAccount`
--

INSERT INTO `employeeAccount` (`id`, `name`, `fathersName`, `mothersName`, `gender`, `nationality`, `nationalidnumber`, `presentAddress`, `permanentAddress`, `email`, `mobile`, `objective`, `presentSalary`, `expectedSalary`, `joblevel`, `careerSummary`, `specialQualification`, `employeeid`) VALUES
(1, 'Md. Imrul Kais', 'Md. Golam Nobi', 'Mises Khaleda nobi', 'male', 'Bangladeshi', '12345678900983', 'kiel, Germany', 'rajshahi, Bangladesh', 'md.imrulcse@gmail.com', '+8801712363785', 'Passionate programmer', '25000', '35000', 'Mid Level  Job', '1 Year working experience', 'Html,CSS,JAVASCRIPT', 6);

-- --------------------------------------------------------

--
-- Table structure for table `employer`
--

CREATE TABLE IF NOT EXISTS `employer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `aEmail` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `cName` varchar(255) NOT NULL,
  `cPersonName` varchar(255) NOT NULL,
  `cPersonDesignation` varchar(255) NOT NULL,
  `cPersonMobile` varchar(255) NOT NULL,
  `cPersonEmail` varchar(255) NOT NULL,
  `industryType` int(11) NOT NULL,
  `bDescription` text NOT NULL,
  `pEmail` varchar(255) NOT NULL,
  `pCountry` int(11) NOT NULL,
  `pCity` varchar(255) NOT NULL,
  `pContactAddress` varchar(255) NOT NULL,
  `pContactPhone` varchar(255) NOT NULL,
  `webAddress` varchar(255) NOT NULL,
  `policy` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `employer`
--

INSERT INTO `employer` (`id`, `aEmail`, `password`, `cName`, `cPersonName`, `cPersonDesignation`, `cPersonMobile`, `cPersonEmail`, `industryType`, `bDescription`, `pEmail`, `pCountry`, `pCity`, `pContactAddress`, `pContactPhone`, `webAddress`, `policy`) VALUES
(2, 'mofiz@mail.com', '123456789', 'Mofiz Group', 'Mr Hafiz', 'HR Manager', '123456789', 'hafiz@mail.com', 3, '', 'info@mail.com', 1, 'Dhaka', 'Motijheel, Dhaka', '123456789', '', 'confirmed'),
(3, 'tanvir@gmail.com', '12345678', 'Tanvir Incorporation', 'Mr Rahman', 'HR Manager', '01764321654', 'rahman@gmail.com', 4, 'Tanvir Incorporation is well known company in Bangladesh. We are selling equipment for ready made garment and knitting industries.', 'rahman@gmail.com', 1, 'Gazipur', 'BSISIC area, Gazipur.', '01764321654', 'www.tanvirinc.info', 'confirmed'),
(4, 'mdimrul@gmail.com', '12345678', 'it company', 'Jahid', 'Programmer', '+8801712457854', 'jahid1@gmail.com', 1, 'test', 'emosn@gmail.com', 1, 'kiel', 'mettenhof', '+8801241458762', 'explore.com', 'confirmed');

-- --------------------------------------------------------

--
-- Table structure for table `industry`
--

CREATE TABLE IF NOT EXISTS `industry` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `industry`
--

INSERT INTO `industry` (`id`, `name`) VALUES
(1, 'It/Communication'),
(2, 'Accounting'),
(3, 'Bank'),
(4, 'Commercial');

-- --------------------------------------------------------

--
-- Table structure for table `postnewjob`
--

CREATE TABLE IF NOT EXISTS `postnewjob` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `companyname` varchar(255) NOT NULL,
  `companyindustrytype` varchar(255) NOT NULL,
  `jobtitle` varchar(255) NOT NULL,
  `noofvacancies` int(11) NOT NULL,
  `jobdetails` text NOT NULL,
  `applyinstructions` text NOT NULL,
  `applicationdeadline` date NOT NULL,
  `billingcontact` text NOT NULL,
  `employeerId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=32 ;

--
-- Dumping data for table `postnewjob`
--

INSERT INTO `postnewjob` (`id`, `companyname`, `companyindustrytype`, `jobtitle`, `noofvacancies`, `jobdetails`, `applyinstructions`, `applicationdeadline`, `billingcontact`, `employeerId`) VALUES
(27, 'Mofiz Group', '1', 'IT Officer', 3, '- Ability to manage a server based network environment.\r\n- Ability to configure and maintain mail server, data center, DNS, DHCP server.\r\n- On demand user end support.\r\n- Have knowledge on hardware installation and troubleshoot.\r\n- At least 2 years of working experience on related job.', '- Apply online or send resume/ CV to via email to this address: hafiz@mail.com', '2016-12-30', 'Motijheel C/A 55\r\nDhaka -1100', 2),
(28, 'Tanvir Incorporation', '4', 'Accountant', 2, '- Maintain the financial operation.\r\n- Keep track on all financial transaction.\r\n- 3 years of work experience in related field.', '- Apply online or send resume/ CV to via email to this address: rahman@mail.com', '2016-12-25', 'BSISIC area, Gazipur.', 3),
(29, 'Tanvir Incorporation', '3', 'Programm Developer', 6, '- We are looking for those people who are expert in object oriented programming language.\r\n- Must have knowledge in javascript, java.\r\n- Must have experience at least 3 years for related job.', '- Apply online or send resume to rahman@gmail.com', '2016-12-30', 'BSISIC area, Gazipur.', 3),
(30, 'Mofiz Incorporation', '2', 'Finance Manager', 1, '- Able to manage finance department and able to maintain a team.\r\n- Have at least 5 years of experience at related field.', 'Apply online or send resume via email to rahman@gmail,com', '2017-03-01', 'BSICSS Area,\r\nGazipur.', 3),
(31, 'Alexing', '1', 'Web developer', 1, 'test', 'test', '2016-12-23', 'test', 3);

-- --------------------------------------------------------

--
-- Table structure for table `test`
--

CREATE TABLE IF NOT EXISTS `test` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `confirmPassword` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `test`
--

INSERT INTO `test` (`id`, `firstname`, `lastname`, `username`, `password`, `confirmPassword`) VALUES
(1, 'asdf asdf as', 'asdf ', 'asdf', 'asdf', 'asdf'),
(2, 'mia', 'asdf ', 'md.i.kais@student.fh-kiel.de', 'as', 'asdfghj'),
(3, 'Nodejs', 'asdf ', 'md.i.kais@student.fh-kiel.de', '123', '456789132'),
(4, 'mia', 'asdf ', 'md.i.kais@student.fh-kiel.de', '123', '456789123'),
(5, 'mia', 'asdf ', '123', '123', '789'),
(6, 'mia', 'asdf ', 'jack', '123456789', '123456789'),
(7, 'mia', 'asdf ', '123', '123789456', '456789456'),
(8, 'mia', 'asdf ', '123', '123456789', '123456789'),
(9, 'mia', 'asdf ', '123', '123456789', '123456789'),
(10, 'mia', 'asdf ', '123', '456789123', '456789123');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=32 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `title`, `firstname`) VALUES
(18, 'first site', 'Nodejs'),
(19, 'adsf asdf asdf', 'Nodejs'),
(20, 'sdfgsdfg sdfgas', 'Nodejs'),
(21, 'first site', 'Nodejs'),
(22, 'first site', 'Nodejs'),
(23, 'first site', 'Nodejs'),
(24, 'd fsdf asdf asdf d', 'Nodejs'),
(25, 'first site', 'Nodejs'),
(26, 'sdfgsdfg sdfgas', 'Nodejs'),
(27, 'sdfgsdfg', 'Nodejs'),
(28, 'sdfgsdfg sdfgas', 'Nodejs'),
(29, 'sdfgsdfg sdfgas', 'Nodejs'),
(30, 'sdfgsdfg sdfgas', 'Nodejs'),
(31, 'apple', 'mia');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
