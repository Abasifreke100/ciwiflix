import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './schema/movie.schema';
import { SpacesService } from '../spaces/spaces.service';
import { SaveMovie, SaveMovieDocument } from './schema/save-movie.schema';
import {
  SubCategory,
  SubCategoryDocument,
} from '../category/schema/sub-category.schema';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    @InjectModel(SaveMovie.name)
    private saveMovieModel: Model<SaveMovieDocument>,
    @InjectModel(SubCategory.name)
    private subCategoryModel: Model<SubCategoryDocument>,
    private spacesService: SpacesService,
  ) {}

  async create(requestData, files = null) {
    const [thumbnailUrl, videoUrl, subTitleUrl] = await Promise.all([
      this.spacesService.uploadFile(
        files?.thumbnail?.length > 0 && files.thumbnail[0],
      ),
      this.spacesService.uploadFiles(
        files?.video?.length > 0 && files.video[0],
      ),
      this.spacesService.uploadFile(
        files?.subTitle?.length > 0 && files.subTitle[0],
      ),
    ]);

    const uploadUrls = {
      thumbnail: thumbnailUrl,
      video: videoUrl,
      subTitle: subTitleUrl,
    };

    const data = { ...requestData, ...uploadUrls };
    try {
      console.log(uploadUrls);
      return await this.movieModel.create(data);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async paginate(query: any, req) {
    let { currentPage, size, sort } = query;

    currentPage = Number(currentPage) ? parseInt(currentPage) : 1;
    size = Number(size) ? parseInt(size) : 10;
    sort = sort ? sort : 'desc';

    const categoryFilter = req.query.category;

    let findQuery = {};

    if (categoryFilter) {
      const matchingCategory = await this.subCategoryModel.findOne({
        name: categoryFilter,
      });

      if (!matchingCategory) {
        return {
          response: [],
          pagination: {
            total: 0,
            currentPage,
            size,
          },
        };
      }

      const categoryId = matchingCategory._id;
      findQuery = {
        subCategory: categoryId,
      };
    }

    const count = await this.movieModel.countDocuments(findQuery);

    const result = await this.movieModel
      .find(findQuery)
      .skip(size * (currentPage - 1))
      .limit(size)
      .sort({ createdAt: sort })
      .populate({
        path: 'subCategory',
        model: 'SubCategory',
        select: '-updatedAt -createdAt -__v -limit',
        populate: {
          path: 'category',
          model: 'Category',
          select: '-updatedAt -createdAt -__v -limit',
        },
      });

    return {
      response: result,
      pagination: {
        total: count,
        currentPage,
        size,
      },
    };
  }

  async delete(id) {
    const movie = await this.movieModel.findByIdAndDelete({
      _id: id,
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return;
  }

  async update(id, requestData, files: any) {
    try {
      const thumbnailUrl = files?.thumbnail
        ? await this.spacesService.uploadFile(files.thumbnail[0])
        : undefined;
      const videoUrl = files?.video
        ? await this.spacesService.uploadFile(files.video[0])
        : undefined;
      const subTitleUrl = files?.subTitle
        ? await this.spacesService.uploadFile(files.subTitle[0])
        : undefined;

      const uploadUrls = {
        ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
        ...(videoUrl && { video: videoUrl }),
        ...(subTitleUrl && { subTitle: subTitleUrl }),
        ...requestData,
      };

      const movie = await this.movieModel
        .findByIdAndUpdate(id, uploadUrls, {
          new: true,
        })
        .populate({
          path: 'subCategory',
          model: 'SubCategory',
          select: '-updatedAt -createdAt -__v -limit',
          populate: {
            path: 'category',
            model: 'Category',
            select: '-updatedAt -createdAt -__v -limit',
          },
        });

      if (!movie) {
        throw new NotFoundException('Movie not found');
      }

      return movie;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async reportVideo(id, requestData) {
    try {
      const movie = await this.movieModel.findByIdAndUpdate(id, requestData, {
        new: true,
      });

      if (!movie) {
        throw new NotFoundException('Movie not found');
      }

      return movie;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async listReportedMovie(query: any) {
    let { currentPage, size, sort } = query;

    currentPage = Number(currentPage) ? parseInt(currentPage) : 1;
    size = Number(size) ? parseInt(size) : 10;
    sort = sort ? sort : 'desc';

    delete query.currentPage;
    delete query.size;
    delete query.sort;

    const count = await this.movieModel.count({ isReported: true });
    const response = await this.movieModel
      .find({ isReported: true })
      .skip(size * (currentPage - 1))
      .limit(size)
      .populate({
        path: 'subCategory',
        model: 'SubCategory',
        select: '-updatedAt -createdAt -__v -limit',
        populate: {
          path: 'category',
          model: 'Category',
          select: '-updatedAt -createdAt -__v -limit',
        },
      })
      .sort({ createdAt: sort });

    return {
      response,
      pagination: {
        total: count,
        currentPage,
        size,
      },
    };
  }

  async moviesForDisplay(query: any, req) {
    let { currentPage, size, sort } = query;

    currentPage = Number(currentPage) ? parseInt(currentPage) : 1;
    size = Number(size) ? parseInt(size) : 10;
    sort = sort ? sort : 'desc';

    const categoryFilter = req.query.category;
    let categoryId;

    if (categoryFilter) {
      const matchingCategory = await this.subCategoryModel.findOne({
        name: categoryFilter,
      });

      if (!matchingCategory) {
        return {
          response: [],
          pagination: {
            total: 0,
            currentPage,
            size,
          },
        };
      }

      categoryId = matchingCategory._id;
    }

    const count = await this.movieModel.countDocuments({
      isReported: false,
      categoryId,
    });

    const result = await this.movieModel
      .find({
        isReported: false,
        categoryId,
      })
      .skip(size * (currentPage - 1))
      .limit(size)
      .sort({ createdAt: sort })
      .populate({
        path: 'subCategory',
        model: 'SubCategory',
        select: '-updatedAt -createdAt -__v -limit',
        populate: {
          path: 'category',
          model: 'Category',
          select: '-updatedAt -createdAt -__v -limit',
        },
      });

    return {
      response: result,
      pagination: {
        total: count,
        currentPage,
        size,
      },
    };
  }

  async saveMovie(id, user) {
    const existingSavedMovie = await this.saveMovieModel.findOne({
      user: user._id,
      movie: id,
    });

    if (existingSavedMovie) {
      throw new BadRequestException('Video already saved');
    }

    const saveMovie = await this.saveMovieModel.create({
      user: user._id,
      movie: id,
    });

    if (!saveMovie) {
      throw new BadRequestException('Something when wrong');
    }

    return saveMovie;
  }

  async listSaveMovie(query: any, user) {
    let { currentPage, size, sort } = query;

    currentPage = Number(currentPage) ? parseInt(currentPage) : 1;
    size = Number(size) ? parseInt(size) : 10;
    sort = sort ? sort : 'desc';

    delete query.currentPage;
    delete query.size;
    delete query.sort;

    const count = await this.saveMovieModel.count({ user: user._id });
    const response = await this.saveMovieModel
      .find({ user: user._id })
      .populate({
        path: 'movie',
        populate: {
          path: 'subCategory',
          model: 'SubCategory',
          select: '-updatedAt -createdAt -__v -limit',
          populate: {
            path: 'category',
            model: 'Category',
            select: '-updatedAt -createdAt -__v -limit',
          },
        },
      })
      .skip(size * (currentPage - 1))
      .limit(size)
      .sort({ createdAt: sort });

    return {
      response,
      pagination: {
        total: count,
        currentPage,
        size,
      },
    };
  }
  async removeSaveMovie(id) {
    const savedMovie = await this.saveMovieModel.findByIdAndDelete({
      _id: id,
    });

    if (!savedMovie) {
      throw new NotFoundException('Movie not found');
    }

    return;
  }

  async getMovieByParentalGuide(query, user) {
    let { currentPage, size, sort } = query;

    currentPage = Number(currentPage) ? parseInt(currentPage) : 1;
    size = Number(size) ? parseInt(size) : 10;
    sort = sort ? sort : 'desc';

    // Determine the filter based on the user's parentalGuide setting
    const filter = user.parentalGuide ? { parentalGuide: { $lt: 18 } } : {};

    const count = await this.movieModel.countDocuments(filter);

    const result = await this.movieModel
      .find(filter)
      .skip(size * (currentPage - 1))
      .limit(size)
      .sort({ createdAt: sort })
      .populate({
        path: 'subCategory',
        model: 'SubCategory',
        select: '-updatedAt -createdAt -__v -limit',
        populate: {
          path: 'category',
          model: 'Category',
          select: '-updatedAt -createdAt -__v -limit',
        },
      });

    return {
      response: result,
      pagination: {
        total: count,
        currentPage,
        size,
      },
    };
  }

  async updateViewMovieCount(id) {
    try {
      const movie = await this.movieModel.findByIdAndUpdate(
        id,
        { $inc: { viewCount: 1 } },
        { new: true },
      );

      if (!movie) {
        throw new NotFoundException('Movie not found');
      }

      return movie;
    } catch (error) {
      throw error.message;
    }
  }
}
