import { Request, Response } from 'express';
import prisma from '../config/database';

interface AuthRequest extends Request {
  userId?: number;
}

export const createList = async (req: AuthRequest, res: Response) => {
  try {
    const { name, totalValue } = req.body;
    const userId = req.userId;

    const list = await prisma.list.create({
      data: {
        name,
        totalValue,
        userId: userId!,
      },
    });

    return res.json(list);
  } catch (error) {
    return res.status(400).json({ error: 'Error creating list' });
  }
};

export const getLists = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const lists = await prisma.list.findMany({
      where: { userId: userId! },
      include: { products: true },
    });

    return res.json(lists);
  } catch (error) {
    return res.status(400).json({ error: 'Error fetching lists' });
  }
};

export const updateList = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, totalValue } = req.body;
    const userId = req.userId;

    const list = await prisma.list.update({
      where: { id: Number(id), userId: userId! },
      data: { name, totalValue },
    });

    return res.json(list);
  } catch (error) {
    return res.status(400).json({ error: 'Error updating list' });
  }
};

export const deleteList = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    await prisma.list.delete({
      where: { id: Number(id), userId: userId! },
    });

    return res.json({ message: 'List deleted successfully' });
  } catch (error) {
    return res.status(400).json({ error: 'Error deleting list' });
  }
};
