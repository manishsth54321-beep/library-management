import Member from "../models/Member.js";

// @desc    Get all members
// @route   GET /api/members
// @access  Private
export const getAllMembers = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { membershipId: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const members = await Member.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching members",
      error: error.message,
    });
  }
};

// @desc    Get single member by ID
// @route   GET /api/members/:id
// @access  Private
export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching member",
      error: error.message,
    });
  }
};

// @desc    Create new member
// @route   POST /api/members
// @access  Private
export const createMember = async (req, res) => {
  try {
    const { name, email, phone, address, status } = req.body;

    // Check if member with same email already exists
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "Member with this email already exists",
      });
    }

    const member = await Member.create({
      name,
      email,
      phone,
      address,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Member created successfully",
      data: member,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating member",
      error: error.message,
    });
  }
};

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private
export const updateMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // If email is being updated, check if it's already taken
    if (req.body.email && req.body.email !== member.email) {
      const existingMember = await Member.findOne({ email: req.body.email });
      if (existingMember) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Member updated successfully",
      data: updatedMember,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating member",
      error: error.message,
    });
  }
};

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private
export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    await Member.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting member",
      error: error.message,
    });
  }
};