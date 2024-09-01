import { Request, Response } from 'express';
import prisma from '../config/database';

interface AuthRequest extends Request {
  userId?: number;
}

export const addProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { listId, name, price, quantity } = req.body;
    const userId = req.userId;

    const list = await prisma.list.findFirst({
      where: { id: Number(listId), userId: userId! },
    });

    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price,
        quantity,
        listId: Number(listId),
      },
    });

    await prisma.list.update({
      where: { id: Number(listId) },
      data: { totalValue: { decrement: price * quantity } },
    });

    return res.json(product);
  } catch (error) {
    return res.status(400).json({ error: 'Error adding product' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, quantity } = req.body;
    const userId = req.userId;

    const product = await prisma.product.findFirst({
      where: { id: Number(id) },
      include: { list: true },
    });

    if (!product || product.list.userId !== userId) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const oldTotal = product.price * product.quantity;
    const newTotal = price * quantity;

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: { name, price, quantity },
    });

    await prisma.list.update({
      where: { id: product.listId },
      data: { totalValue: { increment: oldTotal - newTotal } },
    });

    return res.json(updatedProduct);
  } catch (error) {
    return res.status(400).json({ error: 'Error updating product' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const product = await prisma.product.findFirst({
      where: { id: Number(id) },
      include: { list: true },
    });

    if (!product || product.list.userId !== userId) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    // Update list total value
    await prisma.list.update({
      where: { id: product.listId },
      data: { totalValue: { increment: product.price * product.quantity } },
    });

    return res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(400).json({ error: 'Error deleting product' });
  }
};

export const searchProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.query;
    const userId = req.userId;

    const products = await prisma.product.findMany({
      where: {
        name: { contains: name as string, mode: 'insensitive' },
        list: { userId: userId! },
      },
      include: { list: true },
    });

    return res.json(products);
  } catch (error) {
    return res.status(400).json({ error: 'Error searching products' });
  }
};
