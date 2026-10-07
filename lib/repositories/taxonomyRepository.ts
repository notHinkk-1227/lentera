// Repository fakultas & kategori (data master yang dikelola admin, FR-ADM-01).
import { db } from "@/lib/db";

const byName = { name: "asc" } as const;

export const facultyRepository = {
  findAll() {
    return db.faculty.findMany({ orderBy: byName, select: { id: true, name: true } });
  },
  count() {
    return db.faculty.count();
  },
  findByName(name: string) {
    return db.faculty.findFirst({ where: { name: { equals: name, mode: "insensitive" } } });
  },
  create(name: string) {
    return db.faculty.create({ data: { name }, select: { id: true, name: true } });
  },
  findUsage(id: string) {
    return db.faculty.findUnique({
      where: { id },
      select: { _count: { select: { users: true, articles: true } } },
    });
  },
  delete(id: string) {
    return db.faculty.delete({ where: { id } });
  },
};

export const categoryRepository = {
  findAll() {
    return db.category.findMany({ orderBy: byName, select: { id: true, name: true } });
  },
  findManyByIds(ids: string[]) {
    return db.category.findMany({ where: { id: { in: ids } }, select: { id: true } });
  },
  findByName(name: string) {
    return db.category.findFirst({ where: { name: { equals: name, mode: "insensitive" } } });
  },
  create(name: string) {
    return db.category.create({ data: { name }, select: { id: true, name: true } });
  },
  findUsage(id: string) {
    return db.category.findUnique({
      where: { id },
      select: { _count: { select: { articles: true } } },
    });
  },
  delete(id: string) {
    return db.category.delete({ where: { id } });
  },
};
